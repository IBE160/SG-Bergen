import { create } from 'zustand'
import { Tables } from '@/db/types'

type Player = Tables<'players'> & {
  users: Tables<'users'> | null
}

interface LobbyState {
  players: Player[]
  isLoading: boolean
  error: string | null
  gameStatus: string // 'waiting' | 'selecting' | 'active' | 'finished'
  setPlayers: (players: Player[]) => void
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
  updatePlayer: (player: Tables<'players'>) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setGameStatus: (status: string) => void
}

export const useLobbyStore = create<LobbyState>((set) => ({
  players: [],
  isLoading: false,
  error: null,
  gameStatus: 'waiting',
  setPlayers: (players) => set({ players }),
  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),
  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),
  updatePlayer: (updatedPlayer) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === updatedPlayer.id ? { ...p, ...updatedPlayer } : p
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setGameStatus: (status) => set({ gameStatus: status }),
}))