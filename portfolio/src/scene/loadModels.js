// File: src/scene/loadModels.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PhysicsInfoMap } from '../data/physicsData.js';
import { planetInfoMap } from '../data/planetData.js';

export const clickableObjects = [];
export const meshToModelMap = new Map(); // new: map mesh -> parent model

export const rotatingModels = [];
export const orbitingBodies = [];

const blackHolePosition = PhysicsInfoMap.blackHolePosition;
const G = PhysicsInfoMap.G;
const M = PhysicsInfoMap.M;
let i = 0; // Counter for angle offset

function calculateTangentialVelocity(position, speedMultiplier = 1) {
  const radiusVector = position.clone().sub(blackHolePosition);
  const distance = radiusVector.length();

  // Orbital speed (v = sqrt(GM / r))
  const speed = Math.sqrt(G * M / distance) * speedMultiplier;

  // Get a perpendicular vector in the XZ plane
  const perpendicular = new THREE.Vector3(-radiusVector.z, 0, radiusVector.x).normalize();

  return perpendicular.multiplyScalar(speed);
}


export function loadModels(scene) {
  const loader = new GLTFLoader();

  Object.entries(planetInfoMap).forEach(([planetName, info]) => {
    loader.load(info.modelPath, (gltf) => {
      const model = gltf.scene;

      // model.position.copy(info.modelPosition);
      
      model.scale.setScalar(info.modelScale ?? 1);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.name = planetName;

          clickableObjects.push(child);             // For raycasting
          meshToModelMap.set(child, model);         // Track parent model
        }
      });
      scene.add(model);

      // Self-rotation
      rotatingModels.push({ model, rotSpeed: info.modelRotSpeed ?? 0.01, modelFile: info.modelPath });

      // Orbiting behavior
      if (info.orbiting) {
        const angleOffset = i * 0.5; // Radians spread
        const radius = info.orbitingRadius ?? 80;
        const offsetFactor = info.initialOffset ?? 0;
        const position = new THREE.Vector3(
          blackHolePosition.x + radius * Math.cos(angleOffset),
          blackHolePosition.y,
          blackHolePosition.z + (radius + offsetFactor) * Math.sin(angleOffset)
        );
        i += 1; // Increment angle offset for next model
        model.position.copy(position);
        const velocity = calculateTangentialVelocity(position, info.orbitingSpeed ?? 1);
        orbitingBodies.push({
          mesh: model,
          velocity,
          trail: info.orbitingTrail,
          trailLine: null,
          name: planetName,
          orbitingRadius: radius,
          trailLineColor: info.orbitingTrailColor,
          orbiting: true,
          orbitingSpeed: info.orbitingSpeed,
        });
      }
    });
  });
}
