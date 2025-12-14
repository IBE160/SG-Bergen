import { GameClient } from "./game-client";

export const dynamic = 'force-dynamic';

export default async function GamePlayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  return <GameClient gameCode={code} />;
}