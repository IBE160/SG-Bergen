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
        .select('id, status')
        .eq('code', params.code)
        .single();

      if (error || !gameSession) {
        router.push('/');
        return;
      }

      setGameId(gameSession.id);

      const { data: initialPlayers, error: playersError } = await supabase
        .from('players')
        .select('*, users(username)')
        .eq('game_id', gameSession.id);

      if (playersError) {
        console.error(playersError);
        return;
      }
      setPlayers(initialPlayers as unknown as Player[]);
    };

    fetchInitialData();
  }, [params.code, router, setGameId, setPlayers, supabase]);

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase.channel(`game:${gameId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq:${gameId}`,
        },
        async (payload) => {
            const { data: newPlayer, error } = await supabase
                .from('players')
                .select('*, users(username)')
                .eq('id', payload.new.id)
                .single();
            if (error) {
                console.error(error);
                return;
            }
          addPlayer(newPlayer as unknown as Player);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq:${gameId}`,
        },
        (payload) => {
          const updatedPlayer = payload.new as Player;
          updatePlayerStatus(updatedPlayer.user_id, updatedPlayer.is_ready);
        }
      )
      .on('broadcast', { event: 'game-starting' }, () => {
        router.push(`/game-play/${params.code}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, params.code, router, addPlayer, updatePlayerStatus, supabase]);
  
  useEffect(() => {
    if (players.length === 2 && players.every((p) => p.is_ready)) {
        if (!gameId) return;
        const channel = supabase.channel(`game:${gameId}`);
        channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                channel.send({
                    type: 'broadcast',
                    event: 'game-starting',
                    payload: {},
                });
            }
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }
  }, [players, gameId, supabase]);

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
              <span>{player.users?.username ?? '...'}</span>
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
