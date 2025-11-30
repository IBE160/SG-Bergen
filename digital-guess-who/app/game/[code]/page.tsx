'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export default function LobbyRoom() {
  const params = useParams()
  // Handle potential array or undefined, although typically string in this route
  const code = Array.isArray(params.code) ? params.code[0] : params.code
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!code) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Game Lobby</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Invite your friend with this code:</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="rounded-md border bg-muted px-4 py-2 text-2xl font-mono tracking-widest">
                {code}
              </div>
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <p className="text-sm font-medium">Waiting for opponent...</p>
            <div className="animate-pulse text-muted-foreground text-xs">
              Real-time updates coming soon...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
