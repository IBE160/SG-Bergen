import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnswerBox from '@/app/game-play/components/AnswerBox';

describe('AnswerBox', () => {
  it('renders question text and buttons', () => {
    render(<AnswerBox question="Is it red?" onAnswer={() => {}} disabled={false} />);
    expect(screen.getByText("Is it red?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /No/i })).toBeInTheDocument();
  });

  it('calls onAnswer with "yes" when Yes is clicked', () => {
    const handleAnswer = jest.fn();
    render(<AnswerBox question="Q" onAnswer={handleAnswer} disabled={false} />);
    fireEvent.click(screen.getByRole('button', { name: /Yes/i }));
    expect(handleAnswer).toHaveBeenCalledWith('yes');
  });

  it('calls onAnswer with "no" when No is clicked', () => {
    const handleAnswer = jest.fn();
    render(<AnswerBox question="Q" onAnswer={handleAnswer} disabled={false} />);
    fireEvent.click(screen.getByRole('button', { name: /No/i }));
    expect(handleAnswer).toHaveBeenCalledWith('no');
  });
});
