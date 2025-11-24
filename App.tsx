import React, { useState, useCallback } from 'react';
import { GameScene } from './components/GameScene';
import { UI } from './components/UI';
import { GameState } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);

  const handleStart = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setGameState(GameState.START);
    // Short timeout to allow state to reset before playing immediately if clicked fast
    setTimeout(() => setGameState(GameState.PLAYING), 10);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GameScene 
          gameState={gameState} 
          setGameState={setGameState}
          score={score}
          setScore={setScore}
        />
      </div>
      <UI 
        gameState={gameState} 
        score={score}
        onStart={handleStart}
        onRestart={handleRestart}
      />
    </div>
  );
}