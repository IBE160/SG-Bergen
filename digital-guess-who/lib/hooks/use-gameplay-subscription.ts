import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/lib/store/game'
import { toast } from 'sonner'

export function useGameplaySubscription(gameId: string | null) {
  const { 
    setGameStatus, 
    setCurrentTurn, 
    setPlayers, 
    setGamePhase,
    setInteraction,
    setLastMove
  } = useGameStore()
  const supabase = createClient()

  useEffect(() => {
    if (!gameId) return

    // Initial fetch of players, session, and state
    const fetchInitial = async () => {
        const { data: session } = await supabase.from('game_sessions').select('*').eq('id', gameId).single();
        if (session) {
            setGameStatus(session.status as any); 
            setCurrentTurn(session.current_turn_player_id);
            if (session.phase) setGamePhase(session.phase);
        }
        
        const { data: currentPlayers } = await supabase.from('players').select('*').eq('game_id', gameId);
        if (currentPlayers) {
            setPlayers(currentPlayers);
        }

        // Fetch latest move to restore interaction state
        const { data: moves } = await supabase
            .from('moves')
            .select('*')
            .eq('game_id', gameId)
            .order('created_at', { ascending: false })
            .limit(1);
            
        if (moves && moves.length > 0) {
            const last = moves[0];
            if (last.action_type === 'question') {
                setInteraction({
                    id: last.id,
                    player_id: last.player_id,
                    text: last.details.question_text,
                    status: 'pending_answer'
                });
            } else {
                setLastMove(last);
            }
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
          
          if (payload.new.phase) {
              setGamePhase(payload.new.phase);
          }
          
          if (newStatus === 'active' && payload.old.status !== 'active') {
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
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'moves',
          filter: `game_id=eq.${gameId}`,
        },
        (payload: any) => {
            const move = payload.new;
            if (move.action_type === 'question') {
                setInteraction({
                    id: move.id,
                    player_id: move.player_id,
                    text: move.details.question_text,
                    status: 'pending_answer'
                });
                toast.info("A question has been asked!");
            } else if (move.action_type === 'answer') {
                setInteraction(null);
                setLastMove(move); 
                toast.info(`Answer received: ${move.details.answer}`);
            }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId, supabase, setGameStatus, setCurrentTurn, setPlayers, setGamePhase, setInteraction, setLastMove])
}
