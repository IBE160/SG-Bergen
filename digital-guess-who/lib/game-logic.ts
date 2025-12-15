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
