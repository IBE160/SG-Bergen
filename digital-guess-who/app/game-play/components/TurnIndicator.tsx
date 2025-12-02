'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/db/types'; // Assuming Database types are available
import { User } from '@supabase/supabase-js';
import { useGameStore } from '../store/game-store';

interface TurnIndicatorProps {
  // Any props if needed, e.g., for custom styling
}

export default function TurnIndicator({}: TurnIndicatorProps) {
  const { currentTurnPlayerId } = useGameStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getUser();
  }, [supabase]);


  const isMyTurn = currentUser && currentTurnPlayerId === currentUser.id;

  if (!currentTurnPlayerId) {
    return null; // Or a loading indicator if needed
  }

  return (
    <div className={`p-2 rounded-md ${isMyTurn ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      {isMyTurn ? 'Your Turn' : "Opponent's Turn"}
    </div>
  );
}
