import { create } from 'zustand'

interface Player {
  id: string
  userId: string
  isReady: boolean
  username?: string
}

interface LobbyState {
  gameCode: string | null
  players: Player[]
  isReady: boolean
  setGameCode: (code: string) => void
  setPlayers: (players: Player[]) => void
  setReady: (isReady: boolean) => void
}

export const useLobbyStore = create<LobbyState>((set) => ({
  gameCode: null,
  players: [],
  isReady: false,
  setGameCode: (code) => set({ gameCode: code }),
  setPlayers: (players) => set({ players }),
  setReady: (isReady) => set({ isReady }),
}))
