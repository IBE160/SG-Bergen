import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLobbyStore } from '@/lib/store/lobby'
import { toast } from 'sonner'
import { Tables } from '@/db/types'

export function useGameSubscription(gameId: string) {
  const { addPlayer, removePlayer, updatePlayer, setGameStatus, setGamePhase } = useLobbyStore()
  const supabase = createClient()

  useEffect(() => {
    if (!gameId) return

    const channel = supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        async (payload) => {
          const newPlayer = payload.new as Tables<'players'>
          
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', newPlayer.user_id)
            .single()

          if (error) {
             console.error('Error fetching user for new player:', error)
             addPlayer({ ...newPlayer, users: null })
             toast.error('Failed to fetch player details for a new player.')
          } else {
             addPlayer({ ...newPlayer, users: userData })
          }
          toast.info('A new player has joined!')
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
        (payload) => {
          updatePlayer(payload.new as Tables<'players'>)
        }
      )
       .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
           const deletedRecord = payload.old as { id: string }
           if (deletedRecord && deletedRecord.id) {
             removePlayer(deletedRecord.id)
             toast.info('A player has left.')
           }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${gameId}`,
        },
        (payload: any) => {
           const newStatus = payload.new.status
           setGameStatus(newStatus)
           if (payload.new.phase) {
               setGamePhase(payload.new.phase)
               if (payload.new.phase === 'selection') {
                   toast.success("Starting selection...");
               }
           }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId, supabase, addPlayer, removePlayer, updatePlayer, setGameStatus, setGamePhase])
}
