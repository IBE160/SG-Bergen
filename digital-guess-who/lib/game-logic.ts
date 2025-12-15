import { createClient } from "@/lib/supabase/client";

export async function submitQuestion(gameId: string, playerId: string, text: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.from('moves').insert({
    game_id: gameId,
    player_id: playerId,
    action_type: 'question',
    details: { question_text: text }
  }).select().single();

  if (error) {
    console.error("Error submitting question:", error);
    throw error;
  }
  
  return data;
}

export async function submitAnswer(gameId: string, playerId: string, answer: 'Yes' | 'No', questionId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.from('moves').insert({
    game_id: gameId,
    player_id: playerId,
    action_type: 'answer',
    details: { answer, related_question_id: questionId }
  }).select().single();

  if (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }

  return data;
}

export async function endPlayerTurn(gameId: string, currentPlayerId: string) {
  const supabase = createClient();

  // Find the opponent's player_id
  const { data: playersInGame, error: playersError } = await supabase
    .from('players')
    .select('id')
    .eq('game_id', gameId);

  if (playersError) {
    console.error("Error fetching players for end turn:", playersError);
    throw playersError;
  }

  const nextPlayer = playersInGame.find(p => p.id !== currentPlayerId);

  if (!nextPlayer) {
    console.error("Opponent not found for turn change.");
    throw new Error("Opponent not found for turn change.");
  }

  // Update the game session to pass the turn using Secure RPC
  const { error: updateError } = await supabase.rpc('end_turn', {
    p_game_id: gameId,
    p_next_player_id: nextPlayer.id
  });

  if (updateError) {
    console.error("Error updating game session for turn change:", updateError);
    throw updateError;
  }
}