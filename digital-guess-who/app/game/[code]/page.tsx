'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLobbyStore, Player } from '@/app/game-lobby/store';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy, RotateCw } from 'lucide-react';

type LobbyPageProps = {
  params: Promise<{ code: string }>;
};

export default function LobbyPage({ params }: LobbyPageProps) {
  const router = useRouter();
  const { code } = use(params);
  
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
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, [supabase]);

  const fetchInitialData = useCallback(async () => {
    if (!code) return;

    const { data: gameSession, error } = await supabase
      .from('game_sessions')
      .select('id, status')
      .eq('code', code)
      .single();

    if (error || !gameSession) {
      console.error("Game session error:", error);
      router.push('/');
      return;
    }

    if (gameSession.status === 'active') {
       router.push(`/game-play/${code}`);
       return;
    }

    setGameId(gameSession.id);

    const { data: initialPlayers, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameSession.id);

    if (playersError) {
      console.error(playersError);
      return;
    }
    setPlayers(initialPlayers as unknown as Player[]);
  }, [code, router, setGameId, setPlayers, supabase]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
            const newPlayer = payload.new as Player;
            addPlayer(newPlayer);
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
      .on(
        'postgres_changes',
        {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_sessions',
            filter: `id=eq:${gameId}`
        },
        (payload) => {
            if (payload.new.status === 'active') {
                router.push(`/game-play/${code}`);
            }
        }
      )
      .on('broadcast', { event: 'game-starting' }, () => {
        router.push(`/game-play/${code}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, code, router, addPlayer, updatePlayerStatus, supabase]);
  
  useEffect(() => {
    // Only the host should trigger the start logic ideally, but we let both check readiness
    if (players.length === 2 && players.every((p) => p.is_ready)) {
      if (!gameId) return;

      const startGame = async () => {
        // 1. Update DB status
        await supabase
            .from('game_sessions')
            .update({ status: 'active' })
            .eq('id', gameId);
        
        // 2. Send broadcast
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
      };

      startGame();
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

  // Debugging
  useEffect(() => {
      if (user && players.length > 0) {
          console.log("User ID:", user.id);
          console.log("Players:", players);
          console.log("Current Player found:", currentPlayer);
      }
  }, [user, players, currentPlayer]);

  if (!user) {
      return <div className="flex min-h-screen items-center justify-center"><p>Loading user data...</p></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Lobby</span>
            <Button variant="ghost" size="sm" onClick={() => fetchInitialData()}>
              <RotateCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Game Code:</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="rounded-md border bg-muted px-4 py-2 text-2xl font-mono tracking-widest">
                {code}
              </div>
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Players</h3>
            <ul className="space-y-3">
              {players.map((player) => (
                <li key={player.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span className="font-medium">{player.users?.username || 'Player'}</span>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${player.is_ready ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {player.is_ready ? 'Ready' : 'Waiting'}
                  </span>
                </li>
              ))}
              {players.length === 0 && <li className="text-muted-foreground text-sm">Waiting for host data...</li>}
            </ul>
             {players.length < 2 && (
                <p className="text-xs text-muted-foreground mt-2 animate-pulse">Waiting for opponent to join...</p>
             )}
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleReady} 
              disabled={!currentPlayer || currentPlayer.is_ready}
              className="w-full"
              size="lg"
            >
              {currentPlayer?.is_ready ? "Waiting for Opponent..." : "I'm Ready!"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}