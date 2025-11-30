'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'

export function JoinGameForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join game')
      }

      const { code: gameCode } = data.data
      router.push(`/game/${gameCode}`)
    } catch (err: any) {
      console.error('Error joining game:', err)
      setError(err.message || 'Failed to join game')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join Game</CardTitle>
        <CardDescription>Enter the 6-character game code to join.</CardDescription>
      </CardHeader>
      <form onSubmit={handleJoin}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="game-code">Game Code</Label>
            <Input
              id="game-code"
              placeholder="ABCXYZ"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join Game
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
