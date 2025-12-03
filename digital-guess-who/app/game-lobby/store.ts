import { create } from 'zustand';
import { Database } from '@/db/types';

export type Player = Database['public']['Tables']['players']['Row'] & { profiles?: { username: string | null } | null };

type LobbyState = {
  players: Player[];
  gameStatus: string;
  gameId: string | null;
};

type LobbyActions = {
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  updatePlayerStatus: (userId: string, isReady: boolean) => void;
  setGameStatus: (status: string) => void;
  setGameId: (gameId: string) => void;
};

export const useLobbyStore = create<LobbyState & LobbyActions>((set) => ({
  players: [],
  gameStatus: 'waiting',
  gameId: null,
  setPlayers: (players) => set({ players }),
  addPlayer: (player) => set((state) => {
    if (state.players.find(p => p.id === player.id)) {
      return state;
    }
    return { players: [...state.players, player] };
  }),
  updatePlayerStatus: (userId, isReady) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.user_id === userId ? { ...p, is_ready: isReady } : p
      ),
    })),
  setGameStatus: (status) => set({ gameStatus: status }),
  setGameId: (gameId) => set({ gameId }),
}));