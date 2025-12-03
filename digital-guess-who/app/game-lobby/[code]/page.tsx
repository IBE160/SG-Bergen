'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLobbyStore, Player } from '../store';
import { User } from '@supabase/supabase-js';

type LobbyPageProps = {
  params: { code: string };
};

export default function LobbyPage({ params }: LobbyPageProps) {
  const router = useRouter();
  const {
    players,
    gameId,
    setPlayers,
    addPlayer,
    updatePlayerStatus,
    setGameId,
  } = useLobbyStore();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: gameSession, error } = await supabase
        .from('game_sessions')
        .select('id, status, host_id')
        .eq('code', params.code)
        .single();

      if (error || !gameSession) {
        router.push('/');
        return;
      }

      setGameId(gameSession.id);
      setHostId(gameSession.host_id);

      const { data: initialPlayers, error: playersError } = await supabase
        .from('players')
        .select('*, profiles(username)')
        .eq('game_id', gameSession.id);

      if (playersError) {
        console.error(playersError);
        return;
      }
      setPlayers(initialPlayers as unknown as Player[]);
    };

    fetchInitialData();
  }, [params.code, router, setGameId, setPlayers, supabase]);

  // This effect handles all channel events
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase.channel(`game:${gameId}`);

    // Listen for new players joining
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players', filter: `game_id=eq.${gameId}` }, async (payload) => {
        console.log('[Lobby] New player inserted, fetching details...');
        const { data: newPlayer, error } = await supabase
            .from('players')
            .select('*, profiles(username)')
            .eq('id', payload.new.id)
            .single();
        if (error) {
            console.error('[Lobby] Error fetching new player details:', error);
            return;
        }
        addPlayer(newPlayer as unknown as Player);
    });

    // Listen for players updating their ready status
    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players', filter: `game_id=eq.${gameId}` }, (payload) => {
        console.log('[Lobby] Player updated:', payload.new);
        const updatedPlayer = payload.new as Player;
        updatePlayerStatus(updatedPlayer.user_id, updatedPlayer.is_ready);
    });

    // Listen for game status updates (backup for broadcast)
    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${gameId}` }, (payload) => {
        console.log('[Lobby] Game session updated:', payload.new);
        if (payload.new.status === 'active') {
            console.log('[Lobby] Game is now active. Redirecting...');
            router.push(`/game-play/${params.code}`);
        }
    });
    
    // Listen for the explicit "game-started" event sent by the host
    channel.on('broadcast', { event: 'game-started' }, () => {
        console.log(`[Lobby] Received game-started broadcast. Navigating to game...`);
        router.push(`/game-play/${params.code}`);
    });

    channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log(`[Lobby] Subscribed to channel game:${gameId}`);
        }
    });

    return () => {
        console.log(`[Lobby] Unsubscribing from channel game:${gameId}`);
        supabase.removeChannel(channel);
    };
  }, [gameId, params.code, router, addPlayer, updatePlayerStatus, supabase]);


  // This effect ONLY tries to start the game, and only the host runs it
  useEffect(() => {
    const tryToStartGame = async () => {
        console.log(`[Lobby] tryToStartGame check: user: ${!!user}, gameId: ${!!gameId}, players: ${players.length}`);
        
        if (!user || !gameId || !hostId || players.length < 2) return;

        const isHost = hostId === user.id;

        // Conditions to start: I am the host, there are 2 players, and both are ready.
        if (isHost && players.length === 2 && players.every((p) => p.is_ready)) {
            console.log('[Lobby Host] Conditions met. Attempting to start game...');

            // 1. Update DB to set turn and status
            const { error } = await supabase
              .from('game_sessions')
              .update({ current_turn_player_id: players[0].user_id, status: 'active' })
              .eq('id', gameId);

            if (error) {
                console.error('[Lobby Host] Failed to update session to start game:', error);
                return;
            }
            
            console.log('[Lobby Host] DB updated. Broadcasting "game-started" event.');

            // 2. Broadcast the start event to all clients (including self)
            const channel = supabase.channel(`game:${gameId}`);
            await channel.send({
                type: 'broadcast',
                event: 'game-started',
                payload: {},
            });
        }
    };

    tryToStartGame();
  }, [players, gameId, user, hostId, supabase]);

  const handleReady = async () => {
    if (!user || !gameId) return;

    const player = players.find((p) => p.user_id === user.id);
    if (!player) return;

    await supabase
      .from('players')
      .update({ is_ready: true })
      .eq('id', player.id);
  };
  
  const currentPlayer = players.find((p) => p.user_id === user?.id);

  return (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-4xl font-bold">Lobby</h1>
      <p className="text-xl mt-2">Game Code: <span className="font-mono bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{params.code}</span></p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Players</h2>
        <ul className="mt-4 space-y-2">
          {players.map((player) => (
            <li key={player.id} className="flex justify-center items-center space-x-4">
              <span>{player.profiles?.username ?? '...'}</span>
              <span className={`px-2 py-1 rounded text-white ${player.is_ready ? 'bg-green-500' : 'bg-red-500'}`}>
                {player.is_ready ? 'Ready' : 'Not Ready'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <button 
          onClick={handleReady} 
          disabled={currentPlayer?.is_ready}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
        >
          I'm Ready
        </button>
      </div>
    </div>
  );
}
