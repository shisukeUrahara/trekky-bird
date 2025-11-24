import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Ship } from './Ship';
import { Obstacles } from './Obstacles';
import { Background } from './Background';
import { CONSTANTS, GameState, ObstacleData } from '../types';
import { audioService } from '../services/audioService';

interface GameSceneProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const GameLogic: React.FC<GameSceneProps> = ({ gameState, setGameState, setScore }) => {
  // Physics State (Refs for performance, avoid re-render loop)
  const shipY = useRef(0);
  const velocity = useRef(0);
  const lastTime = useRef(0);
  const obstaclesRef = useRef<ObstacleData[]>([]);
  const spawnTimer = useRef(0);

  // Visual State (React state to trigger renders)
  const [shipVisualPos, setShipVisualPos] = useState<[number, number, number]>([0, 0, 0]);
  const [shipRotation, setShipRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);

  const resetGame = useCallback(() => {
    shipY.current = 0;
    velocity.current = 0;
    obstaclesRef.current = [];
    setObstacles([]);
    setShipVisualPos([0, 0, 0]);
    setShipRotation([0, 0, 0]);
    setScore(0);
    // Initialize timer to threshold so first obstacle spawns immediately
    spawnTimer.current = CONSTANTS.OBSTACLE_SPAWN_RATE;
  }, [setScore]);

  // Input Handling
  useEffect(() => {
    const handleInput = () => {
      if (gameState === GameState.PLAYING) {
        velocity.current = CONSTANTS.JUMP_FORCE;
        audioService.playJump();
      } else if (gameState === GameState.START) {
         // Handled by UI usually, but spacebar can start too
      }
    };

    window.addEventListener('mousedown', handleInput);
    window.addEventListener('touchstart', handleInput);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') handleInput();
    });

    return () => {
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('keydown', () => {});
    };
  }, [gameState]);

  // Game Loop
  useFrame((state, delta) => {
    if (gameState !== GameState.PLAYING) {
       // Just hover if start
       if (gameState === GameState.START) {
          const time = state.clock.getElapsedTime();
          setShipVisualPos([0, Math.sin(time * 2) * 0.5, 0]);
       }
       return;
    }

    // Cap delta to prevent huge jumps if tab inactive
    const dt = Math.min(delta, 0.1);

    // Physics Update
    velocity.current -= CONSTANTS.GRAVITY * dt;
    shipY.current += velocity.current * dt;

    // Floor/Ceiling Collision
    if (shipY.current < CONSTANTS.FLOOR || shipY.current > CONSTANTS.CEILING) {
      setGameState(GameState.GAME_OVER);
      audioService.playCrash();
    }

    // Obstacle Spawning
    spawnTimer.current += dt;
    if (spawnTimer.current > CONSTANTS.OBSTACLE_SPAWN_RATE) {
      spawnTimer.current = 0;
      const gapY = (Math.random() * 8) - 4; // Random height between -4 and 4
      const newObs: ObstacleData = {
        id: Math.random().toString(36).substr(2, 9),
        x: 14, // Spawn further offscreen right (adjusted for Z=14 camera)
        gapY: gapY,
        passed: false
      };
      obstaclesRef.current.push(newObs);
    }

    // Obstacle Movement & Collision
    // Using simple AABB logic
    // Ship is approx radius 0.5 at (0, shipY)
    // Obstacle is at (obs.x), width 1.5.
    // Gap is from gapY - height/2 to gapY + height/2
    
    const shipRadius = 0.4;
    const obsWidth = CONSTANTS.OBSTACLE_WIDTH;
    const halfObsWidth = obsWidth / 2;
    const halfGap = CONSTANTS.OBSTACLE_GAP_HEIGHT / 2;

    const survivingObstacles: ObstacleData[] = [];

    obstaclesRef.current.forEach(obs => {
      obs.x -= CONSTANTS.SPEED * dt;

      // Collision Check
      // 1. Horizontal overlap
      if (obs.x - halfObsWidth < shipRadius && obs.x + halfObsWidth > -shipRadius) {
        // 2. Vertical check (collision if NOT in gap)
        if (shipY.current + shipRadius > obs.gapY + halfGap || 
            shipY.current - shipRadius < obs.gapY - halfGap) {
            setGameState(GameState.GAME_OVER);
            audioService.playCrash();
        }
      }

      // Score counting
      if (!obs.passed && obs.x < -1) {
        obs.passed = true;
        setScore(prev => prev + 1);
        audioService.playScore();
      }

      // Cleanup
      if (obs.x > -18) { // Increased cleanup range for Z=14 camera
        survivingObstacles.push(obs);
      }
    });

    obstaclesRef.current = survivingObstacles;
    
    // Sync Visuals
    setShipVisualPos([0, shipY.current, 0]);
    setShipRotation([0, 0, Math.min(Math.max(velocity.current * 0.05, -0.5), 0.5)]); // Tilt based on velocity
    setObstacles([...obstaclesRef.current]); // Trigger render
  });

  // Reset on Start
  useEffect(() => {
    if (gameState === GameState.START) {
      resetGame();
    }
  }, [gameState, resetGame]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 14]} />
      <Ship position={shipVisualPos} rotation={shipRotation} />
      <Obstacles obstacles={obstacles} />
      <Background gameState={gameState} />
    </>
  );
};

export const GameScene: React.FC<GameSceneProps> = (props) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <GameLogic {...props} />
    </Canvas>
  );
};