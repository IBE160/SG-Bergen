import { GameClient } from "./game-client";
import { Suspense } from "react";

export default function GamePlayPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GamePlayContent params={params} />
    </Suspense>
  );
}

async function GamePlayContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  return <GameClient gameCode={code} />;
}
