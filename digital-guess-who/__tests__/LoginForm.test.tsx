import { render, screen } from '@testing-library/react'
import { LoginForm } from '../components/login-form'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: () => null
    };
  }
}));

describe('LoginForm', () => {
  it('renders a login form with email and password inputs', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
})