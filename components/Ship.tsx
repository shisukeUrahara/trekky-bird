import React, { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface ShipProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

export const Ship: React.FC<ShipProps> = ({ position, rotation }) => {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slight bobbing or engine vibration
      groupRef.current.rotation.z = rotation[2];
    }
  });

  return (
    <group ref={groupRef} position={position} dispose={null}>
      {/* Saucer Section */}
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Bridge Dome */}
      <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
         <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
         <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Engineering Hull */}
      <mesh position={[-0.4, -0.3, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.1, 0.8, 16]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      {/* Deflector Dish */}
      <mesh position={[-0.05, -0.3, 0]} rotation={[0, 0, -Math.PI / 2]}>
         <cylinderGeometry args={[0.12, 0.05, 0.05, 16]} />
         <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={2} />
      </mesh>

      {/* Neck */}
      <mesh position={[-0.1, -0.15, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color="#999999" />
      </mesh>

      {/* Nacelle Pylons */}
      <mesh position={[-0.5, -0.15, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.8]} />
        <meshStandardMaterial color="#999999" />
      </mesh>

      {/* Nacelles */}
      <group position={[-0.6, 0.1, 0]}>
        {/* Left Nacelle */}
        <mesh position={[0, 0, 0.4]} rotation={[0, 0, -Math.PI / 2]}>
           <cylinderGeometry args={[0.08, 0.08, 1.0, 16]} />
           <meshStandardMaterial color="#dddddd" />
        </mesh>
        {/* Bussard Collector Left */}
        <mesh position={[0.5, 0, 0.4]} rotation={[0, 0, -Math.PI / 2]}>
           <sphereGeometry args={[0.09, 16, 16]} />
           <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
        </mesh>
         {/* Warp Grill Left */}
         <mesh position={[0, 0.05, 0.4]} rotation={[Math.PI/2, 0, 0]}>
           <planeGeometry args={[0.8, 0.05]} />
           <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={3} />
        </mesh>


        {/* Right Nacelle */}
        <mesh position={[0, 0, -0.4]} rotation={[0, 0, -Math.PI / 2]}>
           <cylinderGeometry args={[0.08, 0.08, 1.0, 16]} />
           <meshStandardMaterial color="#dddddd" />
        </mesh>
        {/* Bussard Collector Right */}
        <mesh position={[0.5, 0, -0.4]} rotation={[0, 0, -Math.PI / 2]}>
           <sphereGeometry args={[0.09, 16, 16]} />
           <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
        </mesh>
        {/* Warp Grill Right */}
        <mesh position={[0, 0.05, -0.4]} rotation={[Math.PI/2, 0, 0]}>
           <planeGeometry args={[0.8, 0.05]} />
           <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={3} />
        </mesh>
      </group>
    </group>
  );
};