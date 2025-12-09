// digital-guess-who/app/game-lobby/[code]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyIcon, CheckCircle2, User, Loader2 } from 'lucide-react';
import { useLobbyStore } from '@/lib/store/lobby';
import { useGameSubscription } from '@/lib/hooks/use-game-subscription';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function GameLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const gameCode = params.code as string;
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { players, setPlayers, updatePlayer } = useLobbyStore();
  const supabase = createClient();

  // 1. Fetch Game ID and Initial Players
  useEffect(() => {
    async function initLobby() {
      if (!gameCode) return;

      // Get Game ID from Code
      const { data: gameData, error: gameError } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('code', gameCode)
        .single();

      if (gameError || !gameData) {
        toast.error('Game not found');
        router.push('/');
        return;
      }

      setGameId(gameData.id);

      // Get Current User
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Fetch Players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*, users(*)')
        .eq('game_id', gameData.id);

      if (playersError) {
        toast.error('Error loading players');
      } else {
        setPlayers(playersData as any);
      }
    }
    initLobby();
  }, [gameCode, supabase, router, setPlayers]);

  // 2. Subscribe to Realtime Events
  useGameSubscription(gameId || '');

  // 3. Handle Ready Toggle
  const handleReady = async () => {
    if (!currentUser || !gameId) return;

    const myPlayer = players.find(p => p.user_id === currentUser.id);
    if (!myPlayer) return;

    const newStatus = !myPlayer.is_ready;

    // Optimistic Update
    updatePlayer({ ...myPlayer, is_ready: newStatus });

    const { error } = await supabase
      .from('players')
      .update({ is_ready: newStatus })
      .eq('id', myPlayer.id);

    if (error) {
      toast.error('Failed to update status');
      // Revert
      updatePlayer({ ...myPlayer, is_ready: !newStatus });
    }
  };

  // 4. Handle Navigation (Game Start)
  useEffect(() => {
    if (players.length === 2 && players.every(p => p.is_ready)) {
      toast.success('Both players ready! Starting game...');
      setTimeout(() => {
        router.push(`/game-play/${gameCode}`);
      }, 1000);
    }
  }, [players, gameCode, router]);

  const handleCopyCode = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      toast.success('Game code copied!');
    }
  };

  const myPlayer = players.find(p => p.user_id === currentUser?.id);
  const isReady = myPlayer?.is_ready || false;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Game Lobby</h1>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Share this code with your friend:</h2>

        <div className="flex w-full max-w-sm items-center space-x-2 mx-auto mb-8">
          <Label htmlFor="game-code" className="sr-only">Game Code</Label>
          <Input 
            id="game-code" 
            value={gameCode} 
            readOnly 
            className="flex-1 text-center text-2xl font-mono tracking-widest bg-gray-700 border-gray-600 focus:border-primary text-white" 
          />
          <Button onClick={handleCopyCode} className="bg-primary hover:bg-primary/90">
            <CopyIcon className="h-5 w-5 mr-2" /> Copy
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-medium text-gray-300">Players ({players.length}/2)</h3>
          <div className="flex flex-col gap-3">
            {players.length === 0 && (
               <div className="flex items-center justify-center text-gray-400">
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading players...
               </div>
            )}
            {players.map((player) => (
              <div 
                key={player.id} 
                className="flex items-center justify-between p-3 bg-gray-700 rounded-md border border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-600 p-2 rounded-full">
                    <User className="h-5 w-5 text-gray-300" />
                  </div>
                  <span className="font-medium">
                    {player.users?.username || player.users?.email || 'Unknown Player'} 
                    {player.user_id === currentUser?.id && ' (You)'}
                  </span>
                </div>
                {player.is_ready ? (
                  <span className="flex items-center text-green-400 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Ready
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">Not Ready</span>
                )}
              </div>
            ))}
            
            {players.length === 1 && (
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-700 rounded-md text-gray-500">
                Waiting for opponent to join...
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleReady}
          disabled={!myPlayer || isReady} // Disable if already ready
          className={`w-full text-lg py-6 transition-all ${
            isReady 
              ? 'bg-green-600 hover:bg-green-700 cursor-default' 
              : 'bg-secondary hover:bg-secondary/90'
          }`}
        >
          {isReady ? 'Waiting for opponent...' : "I'm Ready"}
        </Button>
      </div>
    </div>
  );
}
