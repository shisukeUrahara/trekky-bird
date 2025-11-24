import React from 'react';
import { CONSTANTS, ObstacleData } from '../types';

interface ObstaclesProps {
  obstacles: ObstacleData[];
}

const ObstacleMesh: React.FC<{ position: [number, number, number], height: number, isTop: boolean }> = ({ position, height, isTop }) => {
  return (
    <group position={position}>
      {/* The main pillar */}
      <mesh>
        <boxGeometry args={[CONSTANTS.OBSTACLE_WIDTH, height, 1]} />
        <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Neon Edge */}
      <mesh position={[0, isTop ? -height/2 + 0.1 : height/2 - 0.1, 0]}>
        <boxGeometry args={[CONSTANTS.OBSTACLE_WIDTH + 0.1, 0.2, 1.1]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>

      {/* Detail panels */}
      <mesh position={[0, 0, 0.51]}>
         <planeGeometry args={[CONSTANTS.OBSTACLE_WIDTH * 0.8, height * 0.8]} />
         <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

export const Obstacles: React.FC<ObstaclesProps> = ({ obstacles }) => {
  return (
    <>
      {obstacles.map((obs) => {
        // Calculate height of top and bottom parts
        // The world height is roughly -10 to 10 visible
        // gapY is the center. 
        // Top obstacle goes from gapY + gapHeight/2 upwards
        // Bottom obstacle goes from gapY - gapHeight/2 downwards
        
        const topYStart = obs.gapY + CONSTANTS.OBSTACLE_GAP_HEIGHT / 2;
        const bottomYEnd = obs.gapY - CONSTANTS.OBSTACLE_GAP_HEIGHT / 2;
        
        const topHeight = 20; // Arbitrary large number to go offscreen
        const bottomHeight = 20;

        const topPos: [number, number, number] = [obs.x, topYStart + topHeight/2, 0];
        const bottomPos: [number, number, number] = [obs.x, bottomYEnd - bottomHeight/2, 0];

        return (
          <group key={obs.id}>
            <ObstacleMesh position={topPos} height={topHeight} isTop={true} />
            <ObstacleMesh position={bottomPos} height={bottomHeight} isTop={false} />
          </group>
        );
      })}
    </>
  );
};