import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionBox from '@/app/game-play/components/QuestionBox';

describe('QuestionBox', () => {
  it('renders input and button', () => {
    render(<QuestionBox onAsk={() => {}} disabled={false} />);
    expect(screen.getByPlaceholderText(/Does your character/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ask/i })).toBeInTheDocument();
  });

  it('calls onAsk with input value when submitted', () => {
    const handleAsk = jest.fn();
    render(<QuestionBox onAsk={handleAsk} disabled={false} />);
    
    const input = screen.getByPlaceholderText(/Does your character/i);
    fireEvent.change(input, { target: { value: 'Is it a female?' } });
    
    const button = screen.getByRole('button', { name: /Ask/i });
    fireEvent.click(button);
    
    expect(handleAsk).toHaveBeenCalledWith('Is it a female?');
  });

  it('disables input and button when disabled prop is true', () => {
    render(<QuestionBox onAsk={() => {}} disabled={true} />);
    expect(screen.getByPlaceholderText(/Does your character/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Ask/i })).toBeDisabled();
  });
});
