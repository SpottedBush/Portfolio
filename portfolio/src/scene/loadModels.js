// File: src/scene/loadModels.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const clickableObjects = [];
const planetNames = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
];
let idx = 0;

const modelsToLoad = [
  // 'solar_system.glb',
  'PlanetLava.glb',
  'Black hole.glb',
  'PlanetRing.glb',
  'Moon.glb',
  'Rochet ship.glb',
];

const modelPos = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(5, 0, 0),
  new THREE.Vector3(15, 0, 0),
  new THREE.Vector3(20, 0, 0),
  new THREE.Vector3(25, 0, 0),
  new THREE.Vector3(30, 0, 0),
];

const modelRot = [
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (3 * Math.PI) / 4, 0)),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (5 * Math.PI) / 4, 0)),
];
const modelScale = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
const modelRotSpeed = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
const modelScaleSpeed = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06];


export function loadModels(scene) {
  const loader = new GLTFLoader();

  for (const model of modelsToLoad) {
    loader.load(model, (gltf) => {
      const modelLoaded = gltf.scene;
      modelLoaded.position.copy(modelPos[idx]);
      modelLoaded.quaternion.copy(modelRot[idx]);
      modelLoaded.scale.set(modelScale[idx], modelScale[idx], modelScale[idx]);
      modelLoaded.rotation.y += modelRotSpeed[idx];
      modelLoaded.scale.x += modelScaleSpeed[idx];
      modelLoaded.scale.y += modelScaleSpeed[idx];
      modelLoaded.scale.z += modelScaleSpeed[idx];
      modelLoaded.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.name = planetNames[idx];
          idx++;
          clickableObjects.push(child); // Store for raycasting
          child.userData = { name: child.name }; // Optional metadata
        }
      });
      scene.add(modelLoaded);
    });
  }
}