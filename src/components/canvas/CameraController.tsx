import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TransitMode, CameraPreset } from '../../types';

interface CameraControllerProps {
  mode: TransitMode;
  isMobile: boolean;
  isUserInteracting: boolean;
  controlsRef: React.MutableRefObject<{ enabled: boolean; target: THREE.Vector3; update: () => void } | null>;
  onTransitionComplete?: (mode: TransitMode) => void;
}

// Desktop presets
const PRESETS_DESKTOP: Record<TransitMode, CameraPreset> = {
  city:    { position: [0, 18, 34],   target: [0, 2, 0],    fov: 45 },
  air:     { position: [11, 12, 12],  target: [2, 9, 2],    fov: 52 },
  roads:   { position: [14, 4.5, 9],  target: [6, 1.2, 3],  fov: 48 },
  subrail: { position: [6, -7.5, 9.5],target: [0, -4.2, 0], fov: 54 },
};

// Mobile portrait presets — pulled back further so the city never clips edges
const PRESETS_MOBILE: Record<TransitMode, CameraPreset> = {
  city:    { position: [0, 22, 46],   target: [0, 1, 0],    fov: 60 },
  air:     { position: [10, 16, 22],  target: [0, 9, 0],    fov: 65 },
  roads:   { position: [16, 8, 18],   target: [4, 1, 2],    fov: 62 },
  subrail: { position: [8, -6, 16],   target: [0, -4, 0],   fov: 65 },
};

export const CameraController: React.FC<CameraControllerProps> = ({
  mode,
  isMobile,
  isUserInteracting,
  controlsRef,
  onTransitionComplete,
}) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 1, 0));
  const desiredTarget = useRef(new THREE.Vector3(0, 1, 0));
  const desiredPos    = useRef(new THREE.Vector3(0, 22, 46));
  const desiredFov    = useRef(45);
  const isTransitioning = useRef(false);
  const initialFovSet = useRef(false);

  useEffect(() => {
    const presets = isMobile ? PRESETS_MOBILE : PRESETS_DESKTOP;
    const preset  = presets[mode];
    desiredPos.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);
    desiredFov.current = preset.fov;

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }

    const perspCam = camera as THREE.PerspectiveCamera;
    if (!initialFovSet.current) {
      perspCam.fov = preset.fov;
      perspCam.updateProjectionMatrix();
      initialFovSet.current = true;
    }

    isTransitioning.current = true;
  }, [mode, isMobile, camera, controlsRef]);

  useFrame((_, delta) => {
    // Frame-rate independent exponential smoothing
    const lerpSpeed = 1 - Math.exp(-3.4 * Math.min(delta, 0.1));

    const posDist    = camera.position.distanceTo(desiredPos.current);
    const targetDist = currentTarget.current.distanceTo(desiredTarget.current);
    const perspCam   = camera as THREE.PerspectiveCamera;
    const fovDiff    = Math.abs(perspCam.fov - desiredFov.current);

    if (isTransitioning.current && posDist < 0.25 && targetDist < 0.2 && fovDiff < 0.3) {
      isTransitioning.current = false;
      if (controlsRef.current) {
        controlsRef.current.target.copy(desiredTarget.current);
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
      onTransitionComplete?.(mode);
    }

    if (isTransitioning.current && !isUserInteracting) {
      camera.position.lerp(desiredPos.current, lerpSpeed);
      currentTarget.current.lerp(desiredTarget.current, lerpSpeed);
      camera.lookAt(currentTarget.current);

      if (controlsRef.current) {
        controlsRef.current.target.copy(currentTarget.current);
      }

      // Smooth cinematic FOV zoom transition
      if (fovDiff > 0.05) {
        perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, desiredFov.current, lerpSpeed);
        perspCam.updateProjectionMatrix();
      }
    }
  });

  return null;
};
