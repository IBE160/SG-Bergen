import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InteractionPanel } from '../../app/game-play/components/interaction-panel';

// Mocking UI components if they cause issues, but trying integration first
// If shadcn/ui components fail due to ESM/CJS issues, we might need to mock them.
// For now assuming standard setup works.

describe('InteractionPanel', () => {
    const mockAsk = jest.fn();
    const mockAnswer = jest.fn();

    it('renders "Ask" input when it is my turn and idle', () => {
        render(
            <InteractionPanel 
                isMyTurn={true}
                interactionState={{ status: 'idle' }}
                onAskQuestion={mockAsk}
                onAnswerQuestion={mockAnswer}
            />
        );
        expect(screen.getByPlaceholderText('Ask a yes/no question...')).toBeInTheDocument();
        // Check button is disabled initially (empty input)
        expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled();
    });

    it('enables ask button when text is entered', () => {
        render(
            <InteractionPanel 
                isMyTurn={true}
                interactionState={{ status: 'idle' }}
                onAskQuestion={mockAsk}
                onAnswerQuestion={mockAnswer}
            />
        );
        const input = screen.getByPlaceholderText('Ask a yes/no question...');
        fireEvent.change(input, { target: { value: 'Is it red?' } });
        expect(screen.getByRole('button', { name: /ask/i })).toBeEnabled();
        
        fireEvent.click(screen.getByRole('button', { name: /ask/i }));
        expect(mockAsk).toHaveBeenCalledWith('Is it red?');
    });

    it('renders waiting message when asking (waiting for answer)', () => {
        render(
            <InteractionPanel 
                isMyTurn={true}
                interactionState={{ status: 'answering', questionText: 'Is it red?' }}
                onAskQuestion={mockAsk}
                onAnswerQuestion={mockAnswer}
            />
        );
        expect(screen.getByText('Waiting for opponent to answer...')).toBeInTheDocument();
        expect(screen.getByText('"Is it red?"')).toBeInTheDocument();
    });

    it('renders answer buttons when opponent asks', () => {
        render(
            <InteractionPanel 
                isMyTurn={false}
                interactionState={{ status: 'answering', questionText: 'Is it blue?' }}
                onAskQuestion={mockAsk}
                onAnswerQuestion={mockAnswer}
            />
        );
        expect(screen.getByText('"Is it blue?"')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
    });
    
    it('fires onAnswer when Yes is clicked', () => {
        render(
            <InteractionPanel 
                isMyTurn={false}
                interactionState={{ status: 'answering', questionText: 'Is it blue?' }}
                onAskQuestion={mockAsk}
                onAnswerQuestion={mockAnswer}
            />
        );
        
        fireEvent.click(screen.getByRole('button', { name: /yes/i }));
        expect(mockAnswer).toHaveBeenCalledWith('Yes');
    });
});
