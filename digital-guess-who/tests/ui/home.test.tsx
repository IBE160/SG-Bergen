
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock lib/utils
jest.mock('@/lib/utils', () => ({
  hasEnvVars: true,
  cn: (...inputs: any[]) => inputs.join(' '),
}));

// Mock AuthButton/Hero to avoid their internal logic/suspense issues if any
jest.mock('@/components/auth-button', () => ({
  AuthButton: () => <div>Auth Button</div>,
}));
jest.mock('@/components/hero', () => ({
  Hero: () => <div>Hero Section</div>,
}));
jest.mock('@/components/deploy-button', () => ({
  DeployButton: () => <div>Deploy Button</div>,
}));

describe('Home Page (Join Game)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('renders Join Game form', async () => {
    render(<Home />);
    expect(screen.getByText('Join a Game')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ABCD')).toBeInTheDocument();
  });

  it('submits valid code and redirects', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ gameId: 'g1', playerId: 'p1' }),
    });

    render(<Home />);
    
    const input = screen.getByPlaceholderText('ABCD');
    fireEvent.change(input, { target: { value: 'XYZ123' } });
    
    const button = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/game/join', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ code: 'XYZ123' }),
      }));
    });

    expect(mockPush).toHaveBeenCalledWith('/game-lobby/XYZ123');
  });

  it('shows error toast on failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Game not found' }),
    });

    const { toast } = require('sonner');

    render(<Home />);
    
    const input = screen.getByPlaceholderText('ABCD');
    fireEvent.change(input, { target: { value: 'INVALID' } });
    
    const button = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Game not found');
    });
  });
});
