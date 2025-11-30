'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function GameLobbyPage() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateGame = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create game')
      }

      const { code } = data.data
      router.push(`/game/${code}`)
    } catch (error) {
      console.error('Error creating game:', error)
      alert('Failed to create game. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Game</CardTitle>
          <CardDescription>Choose your difficulty level to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4">
            <Label>Difficulty Level</Label>
            <div className="grid gap-2">
              <div className={`flex items-center space-x-2 rounded-md border p-4 hover:bg-accent cursor-pointer ${difficulty === 'Easy' ? 'border-primary bg-accent' : ''}`} onClick={() => setDifficulty('Easy')}>
                <div className={`h-4 w-4 rounded-full border border-primary ${difficulty === 'Easy' ? 'bg-primary' : ''}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Easy</p>
                  <p className="text-xs text-muted-foreground">Small board for quick games.</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 rounded-md border p-4 hover:bg-accent cursor-pointer ${difficulty === 'Medium' ? 'border-primary bg-accent' : ''}`} onClick={() => setDifficulty('Medium')}>
                <div className={`h-4 w-4 rounded-full border border-primary ${difficulty === 'Medium' ? 'bg-primary' : ''}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Medium</p>
                  <p className="text-xs text-muted-foreground">Standard board size.</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 rounded-md border p-4 hover:bg-accent cursor-pointer ${difficulty === 'Hard' ? 'border-primary bg-accent' : ''}`} onClick={() => setDifficulty('Hard')}>
                <div className={`h-4 w-4 rounded-full border border-primary ${difficulty === 'Hard' ? 'bg-primary' : ''}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Hard</p>
                  <p className="text-xs text-muted-foreground">Large board for a challenge.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
          <Button onClick={handleCreateGame} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
