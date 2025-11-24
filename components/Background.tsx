import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Group } from 'three';
import { GameState } from '../types';

interface BackgroundProps {
  gameState: GameState;
}

export const Background: React.FC<BackgroundProps> = ({ gameState }) => {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && gameState === GameState.PLAYING) {
      // Rotate stars to simulate movement
      groupRef.current.rotation.x -= delta * 0.05; 
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" intensity={0.5} />
    </group>
  );
};