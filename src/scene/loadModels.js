// File: src/scene/loadModels.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PhysicsInfoMap } from '../data/physicsData.js';
import { planetInfoMap } from '../data/planetData.js';

export const clickableObjects = [];
export const meshToModelMap = new Map(); // new: map mesh -> parent model

export const animatedMixers = [];
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

function addStarField(scene) {
  const starCount = 10000;
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  for (let i = 0; i < starCount; i++) {
    const x = 500 + (Math.random() - 0.5) * 3000;
    const y = 500 + (Math.random() - 0.5) * 3000;
    const z = 500 + (Math.random() - 0.5) * 3000;
    positions.push(x, y, z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

export function addHitbox(planetMesh, planetName){
  const radius = planetInfoMap[planetName]?.hitboxRadius ?? 1;
  const hitboxGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const hitboxMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.0, // fully invisible
      depthWrite: false // avoid z-fighting
  });
  const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
  hitbox.name = planetName;
  hitbox.position.copy(planetMesh.position);
  hitbox.isHitbox = true; // Custom property to identify hitboxes
  planetMesh.add(hitbox);
  clickableObjects.push(hitbox);
  meshToModelMap.set(hitbox, planetMesh); 
}


export function loadModels(scene) {
  addStarField(scene); // Add star field to the scene
  const loader = new GLTFLoader();

  Object.entries(planetInfoMap).forEach(([planetName, info]) => {
    loader.load(info.modelPath, (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      
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
      addHitbox(model, planetName); // Add hitbox to the model
      if (planetName === "HexClient") {
        // Inner core light (center of the planet)
        const coreLight = new THREE.PointLight(0xFF4500, 10000, 5, 2);
        coreLight.position.set(0, 0, 0);
        model.add(coreLight);

        const ambientGlow = new THREE.PointLight(0xFF4500, 10, 100);
        ambientGlow.position.set(0, 0, 0);
        model.add(ambientGlow);
      }
      
      // Animation setup
      if (planetName === "Education"){
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
        animatedMixers.push(mixer);
        undefined, (error) => {
          console.error('Error loading animated glb:', error);
        }
      }

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
