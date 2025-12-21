"use client"

import { useState } from "react"
import { Send, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type InteractionState = {
  status: 'idle' | 'asking' | 'answering' | 'asked' | 'result'
  questionText?: string
  answer?: 'Yes' | 'No'
}

interface InteractionPanelProps {
  isMyTurn: boolean
  interactionState: InteractionState
  lastMove?: {
    player: string
    action: 'question' | 'answer'
    text: string
    timestamp: Date
  }
  onAskQuestion: (text: string) => void
  onAnswerQuestion: (answer: 'Yes' | 'No') => void
  onGuessClick?: () => void
  isGuessDisabled?: boolean
  isGuessMode?: boolean
}

export function InteractionPanel({
  isMyTurn,
  interactionState,
  lastMove,
  onAskQuestion,
  onAnswerQuestion,
  onGuessClick,
  isGuessDisabled,
  isGuessMode
}: InteractionPanelProps) {
  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Game Interaction</CardTitle>
          <Badge variant={isMyTurn ? "default" : "secondary"}>
            {isMyTurn ? "Your Turn" : "Opponent's Turn"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Interaction Area */}
        <div className="p-4 rounded-lg bg-secondary/20 border border-border">
            {isMyTurn && interactionState.status === 'idle' && (
                <div className="flex flex-col gap-4">
                    <QuestionInput onAsk={onAskQuestion} />
                    <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-border/50"></div>
                        <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase">or</span>
                        <div className="flex-grow border-t border-border/50"></div>
                    </div>
                    <Button 
                        variant={isGuessMode ? "secondary" : "destructive"}
                        className="w-full" 
                        onClick={onGuessClick}
                        disabled={isGuessDisabled}
                    >
                        {isGuessMode ? "Cancel Guess" : "Make a Final Guess"}
                    </Button>
                </div>
            )}

            {isMyTurn && interactionState.status === 'asked' && (
                <div className="flex flex-col gap-4">
                    <div className="text-center p-2 bg-background/50 rounded-md border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">You've asked your question for this turn.</p>
                        {interactionState.answer && (
                            <p className="mt-1 font-semibold text-primary">
                                Answer: {interactionState.answer}
                            </p>
                        )}
                    </div>
                    <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-border/50"></div>
                        <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase">or</span>
                        <div className="flex-grow border-t border-border/50"></div>
                    </div>
                    <Button 
                        variant={isGuessMode ? "secondary" : "destructive"}
                        className="w-full" 
                        onClick={onGuessClick}
                        disabled={isGuessDisabled}
                    >
                        {isGuessMode ? "Cancel Guess" : "Make a Final Guess"}
                    </Button>
                </div>
            )}
            
            {isMyTurn && interactionState.status === 'answering' && (
                <div className="text-center text-muted-foreground">
                    Waiting for opponent to answer...
                    <div className="mt-2 font-medium text-foreground">"{interactionState.questionText}"</div>
                </div>
            )}

            {!isMyTurn && interactionState.status === 'answering' && (
                <AnswerInput 
                    question={interactionState.questionText || "Unknown Question"} 
                    onAnswer={onAnswerQuestion} 
                />
            )}

             {!isMyTurn && interactionState.status === 'idle' && (
                <div className="text-center text-muted-foreground">
                    Waiting for opponent to ask a question...
                </div>
            )}
        </div>

        {/* History Area */}
        {lastMove && <MoveHistory move={lastMove} />}
      </CardContent>
    </Card>
  )
}

function QuestionInput({ onAsk }: { onAsk: (q: string) => void }) {
  const [question, setQuestion] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      onAsk(question)
      setQuestion("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Ask a yes/no question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!question.trim()}>
        Ask
      </Button>
    </form>
  )
}

function AnswerInput({ question, onAnswer }: { question: string, onAnswer: (a: 'Yes' | 'No') => void }) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Opponent Asks:</div>
      <div className="text-lg font-semibold text-center py-2">"{question}"</div>
      <div className="flex justify-center gap-4">
        <Button 
            onClick={() => onAnswer('Yes')} 
            className="w-24 bg-green-600 hover:bg-green-700"
        >
            <Check className="mr-2 h-4 w-4" /> Yes
        </Button>
        <Button 
            onClick={() => onAnswer('No')} 
            variant="destructive"
            className="w-24"
        >
            <X className="mr-2 h-4 w-4" /> No
        </Button>
      </div>
    </div>
  )
}

function MoveHistory({ move }: { move: any }) {
    // Basic formatting
    return (
        <div className="text-sm text-muted-foreground pt-2 border-t">
            <span className="font-semibold">Last Move:</span> {move.text}
        </div>
    )
}
