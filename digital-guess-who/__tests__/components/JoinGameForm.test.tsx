import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { JoinGameForm } from '../../components/join-game-form'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock global fetch
global.fetch = jest.fn()

describe('JoinGameForm', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<JoinGameForm />)
    expect(screen.getByRole('button', { name: /join game/i })).toBeInTheDocument()
    expect(screen.getByText('Enter the 6-character game code to join.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('ABCXYZ')).toBeInTheDocument()
  })

  it('disables button when input is too short', () => {
    render(<JoinGameForm />)
    const input = screen.getByPlaceholderText('ABCXYZ')
    const button = screen.getByRole('button', { name: /join game/i })

    fireEvent.change(input, { target: { value: 'ABC' } })
    expect(button).toBeDisabled()
  })

  it('enables button when input is 6 chars', () => {
    render(<JoinGameForm />)
    const input = screen.getByPlaceholderText('ABCXYZ')
    const button = screen.getByRole('button', { name: /join game/i })

    fireEvent.change(input, { target: { value: 'ABCDEF' } })
    expect(button).toBeEnabled()
  })

  it('submits form and redirects on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { code: 'ABCDEF' } }),
    })

    render(<JoinGameForm />)
    const input = screen.getByPlaceholderText('ABCXYZ')
    const button = screen.getByRole('button', { name: /join game/i })

    fireEvent.change(input, { target: { value: 'ABCDEF' } })
    fireEvent.click(button)

    expect(button).toBeDisabled() // loading
    expect(global.fetch).toHaveBeenCalledWith('/api/game/join', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ code: 'ABCDEF' }),
    }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/game/ABCDEF')
    })
  })

  it('displays error message on failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid game code' }),
    })

    render(<JoinGameForm />)
    const input = screen.getByPlaceholderText('ABCXYZ')
    const button = screen.getByRole('button', { name: /join game/i })

    fireEvent.change(input, { target: { value: 'INVALID' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Invalid game code')).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})
