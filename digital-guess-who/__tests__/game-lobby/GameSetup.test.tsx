import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GameLobbyPage from '../../app/game-lobby/page'
import { useRouter } from 'next/navigation'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: { code: 'ABC123' } }),
  })
) as jest.Mock

describe('GameLobbyPage', () => {
  it('renders difficulty selection and create button', () => {
    render(<GameLobbyPage />)
    expect(screen.getByText('Create New Game')).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Hard')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create game/i })).toBeInTheDocument()
  })

  it('calls create game API with selected difficulty', async () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

    render(<GameLobbyPage />)

    // Select Easy difficulty (it defaults to Medium)
    fireEvent.click(screen.getByText('Easy'))

    // Click create
    fireEvent.click(screen.getByRole('button', { name: /create game/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/game/create', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ difficulty: 'Easy' }),
      }))
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/game/ABC123')
    })
  })
})
