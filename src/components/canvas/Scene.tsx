import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CityModel } from './CityModel';
import { AirTransit } from './AirTransit';
import { SmartRoads } from './SmartRoads';
import { SubRail } from './SubRail';
import { CameraController } from './CameraController';
import { TransitMode } from '../../types';

interface SceneProps {
  mode: TransitMode;
  isMobile: boolean;
  onCameraArrived: (mode: TransitMode) => void;
}

export const Scene: React.FC<SceneProps> = ({ mode, isMobile, onCameraArrived }) => {
  const isSubrail = mode === 'subrail';
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Reduce star count on mobile for performance
  const starCount = isMobile ? 1600 : 4000;

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        // Start at the mobile-friendly city overview position
        camera={{ position: [0, 22, 46], fov: isMobile ? 60 : 45, near: 0.1, far: 600 }}
        gl={{
          antialias: !isMobile,           // disable AA on mobile = big perf gain
          powerPreference: 'high-performance',
          alpha: false,
          // Limit pixel ratio on mobile to cap render load
        }}
        dpr={isMobile ? [1, 1.35] : [1, 2]}
      >
        <color attach="background" args={[isSubrail ? '#011022' : '#030712']} />
        <fog
          attach="fog"
          args={[
            isSubrail ? '#011226' : '#030712',
            isSubrail ? 10 : (isMobile ? 20 : 25),
            isSubrail ? 45 : (isMobile ? 90 : 120),
          ]}
        />

        {/* === LIGHTING === */}
        <ambientLight
          intensity={isSubrail ? 0.8 : 0.5}
          color={isSubrail ? '#00e5ff' : '#1e293b'}
        />
        <directionalLight
          position={[25, 30, 20]}
          intensity={isSubrail ? 0.6 : 1.6}
          color="#dbeafe"
          castShadow={!isMobile}
        />
        <directionalLight
          position={[-15, -20, -10]}
          intensity={isSubrail ? 2.2 : 1.2}
          color="#00F2FE"
        />
        <pointLight
          position={[0, -10, 0]}
          color={isSubrail ? '#00a6ff' : '#FF7B00'}
          intensity={isSubrail ? 5 : 3}
          distance={35}
        />

        {/* Deep Space Stars — reduced on mobile */}
        <Stars
          radius={isMobile ? 80 : 120}
          depth={40}
          count={starCount}
          factor={4}
          saturation={1}
          fade
          speed={0.6}
        />

        <Suspense fallback={null}>
          <OrbitControls
            ref={controlsRef}
            enabled={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={isMobile ? 0.75 : 1}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
            minDistance={10}
            maxDistance={85}
            maxPolarAngle={Math.PI * 0.86}
            onStart={() => setIsUserInteracting(true)}
            onEnd={() => setIsUserInteracting(false)}
          />
          <CameraController
            mode={mode}
            isMobile={isMobile}
            isUserInteracting={isUserInteracting}
            controlsRef={controlsRef}
            onTransitionComplete={onCameraArrived}
          />
          <CityModel />
          <AirTransit />
          <SmartRoads />
          <SubRail />
        </Suspense>
      </Canvas>
    </div>
  );
};
