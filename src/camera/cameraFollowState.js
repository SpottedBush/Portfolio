// File: src/camera/cameraFollowState.js
import * as THREE from 'three';
import { PhysicsInfoMap } from '../data/physicsData.js';
import { DEFAULT_CAMERA_OFFSET } from '../scene/setupScene.js';

export const cameraFollowState = {
  active: false,
  target: null,
  offsetY: 20,
  distance: 40,
  blackHolePosition: PhysicsInfoMap.blackHolePosition.clone(),
  smoothedOffset: new THREE.Vector3(), // Smooth interpolation
  smoothingFactor: 0.1,
};

export function startFollowingPlanet(planetMesh) {
  cameraFollowState.active = true;
  cameraFollowState.target = planetMesh;
  cameraFollowState.smoothedOffset.set(0, cameraFollowState.offsetY, cameraFollowState.distance);
}

export function stopFollowingPlanet() {
  cameraFollowState.active = false;
  cameraFollowState.target = null;
}

export function updateCameraFollowing(camera) {
  const state = cameraFollowState;
if (
    !state.active ||
    !state.target ||
    state.target.position.equals(state.blackHolePosition)
) {
    camera.position.copy(DEFAULT_CAMERA_OFFSET);
    camera.lookAt(state.blackHolePosition);
    return;
}
  const planet = state.target;
  const bhPos = state.blackHolePosition;
  const planetPos = planet.position.clone();

  // 1. Compute the ideal camera offset direction (black hole to planet)
  const direction = planetPos.clone().sub(bhPos).normalize();

  // 2. Compute ideal camera position offset
  const idealOffset = direction.clone().multiplyScalar(state.distance);
  idealOffset.y += state.offsetY;

  // 3. Smooth interpolation of the offset vector
  state.smoothedOffset.lerp(idealOffset, state.smoothingFactor);

  // 4. Final camera position = planet position + smoothed offset
  const finalPos = planetPos.clone().add(state.smoothedOffset);
  camera.position.copy(finalPos);
  camera.lookAt(planetPos);
}