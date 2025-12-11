import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/lib/store/game'
import { toast } from 'sonner'

export function useGameplaySubscription(gameId: string | null) {
  const { setGameStatus, setCurrentTurn, setPlayers } = useGameStore()
  const supabase = createClient()

  useEffect(() => {
    if (!gameId) return

    // Initial fetch of players and session
    const fetchInitial = async () => {
        const { data: session } = await supabase.from('game_sessions').select('*').eq('id', gameId).single();
        if (session) {
            setGameStatus(session.status as any); 
            setCurrentTurn(session.current_turn_player_id);
        }
        
        const { data: currentPlayers } = await supabase.from('players').select('*').eq('game_id', gameId);
        if (currentPlayers) {
            setPlayers(currentPlayers);
        }
    };
    fetchInitial();

    const channel = supabase
      .channel(`game-play:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${gameId}`,
        },
        (payload: any) => {
          const newStatus = payload.new.status;
          const newTurn = payload.new.current_turn_player_id;
          
          setGameStatus(newStatus);
          setCurrentTurn(newTurn);
          
          if (newStatus === 'playing' && payload.old.status !== 'playing') {
            toast.info("Game Started!");
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        async (payload: any) => {
           // Fetch fresh list to ensure we have all updates
           const { data: updatedPlayers } = await supabase.from('players').select('*').eq('game_id', gameId);
           if (updatedPlayers) {
               setPlayers(updatedPlayers);
           }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId, supabase, setGameStatus, setCurrentTurn, setPlayers])
}
