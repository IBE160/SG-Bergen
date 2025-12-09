import { renderHook, act } from '@testing-library/react'
import { useGameSubscription } from '@/lib/hooks/use-game-subscription'
import { useLobbyStore } from '@/lib/store/lobby'

// Mock Supabase Client
const mockSubscribe = jest.fn()
const mockRemoveChannel = jest.fn()
// Create a mock object that can be returned by mockOn to allow chaining
const mockChannelObj = {
    on: jest.fn(),
    subscribe: mockSubscribe
}
// Set up the implementation to return 'this' (the mockChannelObj)
mockChannelObj.on.mockReturnValue(mockChannelObj)

const mockChannel = jest.fn().mockReturnValue(mockChannelObj)

jest.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        channel: mockChannel,
        removeChannel: mockRemoveChannel,
        from: () => ({
           select: () => ({
               eq: () => ({
                   single: () => Promise.resolve({ data: { username: 'TestUser' }, error: null })
               })
           }) 
        })
    })
}))

describe('useGameSubscription', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        useLobbyStore.setState({ players: [] })
    })

    it('should subscribe to the game channel', () => {
        renderHook(() => useGameSubscription('game-123'))
        
        expect(mockChannel).toHaveBeenCalledWith('game:game-123')
        expect(mockChannelObj.on).toHaveBeenCalledTimes(3) // INSERT, UPDATE, DELETE
        expect(mockSubscribe).toHaveBeenCalled()
    })
    
    it('should handle INSERT event', async () => {
         // Setup captures
         let insertCallback: any
         mockChannelObj.on.mockImplementation((event, filter, callback) => {
             if (event === 'postgres_changes' && filter.event === 'INSERT') {
                 insertCallback = callback
             }
             return mockChannelObj
         })

         renderHook(() => useGameSubscription('game-123'))

         const newPlayerPayload = {
             new: { id: 'p1', user_id: 'u1', game_id: 'game-123', is_ready: false }
         }

         await act(async () => {
             if (insertCallback) {
                 await insertCallback(newPlayerPayload)
             }
         })

         expect(useLobbyStore.getState().players).toHaveLength(1)
         expect(useLobbyStore.getState().players[0].users?.username).toBe('TestUser')
    })
})
