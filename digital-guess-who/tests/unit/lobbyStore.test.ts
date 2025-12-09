import { act } from '@testing-library/react'
import { useLobbyStore } from '@/lib/store/lobby'

describe('useLobbyStore', () => {
  beforeEach(() => {
    act(() => {
      useLobbyStore.setState({ players: [], isLoading: false, error: null })
    })
  })

  it('should add a player', () => {
    const player = { id: '1', user_id: 'u1', game_id: 'g1', is_ready: false, character_id: null, users: { id: 'u1', username: 'p1', avatar_url: null } }
    
    act(() => {
      useLobbyStore.getState().addPlayer(player)
    })

    expect(useLobbyStore.getState().players).toHaveLength(1)
    expect(useLobbyStore.getState().players[0]).toEqual(player)
  })

  it('should remove a player', () => {
    const player = { id: '1', user_id: 'u1', game_id: 'g1', is_ready: false, character_id: null, users: null }
    act(() => {
        useLobbyStore.getState().addPlayer(player)
    })
    
    act(() => {
      useLobbyStore.getState().removePlayer('1')
    })

    expect(useLobbyStore.getState().players).toHaveLength(0)
  })

  it('should update a player', () => {
    const player = { id: '1', user_id: 'u1', game_id: 'g1', is_ready: false, character_id: null, users: null }
    act(() => {
        useLobbyStore.getState().addPlayer(player)
    })

    act(() => {
      useLobbyStore.getState().updatePlayer({ ...player, is_ready: true })
    })

    expect(useLobbyStore.getState().players[0].is_ready).toBe(true)
  })
})
