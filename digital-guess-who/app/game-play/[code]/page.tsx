export default function GamePlayPage({ params }: { params: { code: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Game Play</h1>
      <p className="text-xl">Game Code: {params.code}</p>
      <div className="mt-8 p-6 bg-gray-800 rounded-lg">
        <p className="text-yellow-400 text-lg">🚧 Under Construction 🚧</p>
        <p className="mt-2 text-gray-400">Epic 3 (Core Gameplay) starts next.</p>
      </div>
    </div>
  )
}
