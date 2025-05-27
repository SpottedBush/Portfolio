// setupScene.js
import * as THREE from 'three';
import { PhysicsInfoMap } from '../data/physicsData.js';

export const DEFAULT_CAMERA_OFFSET = new THREE.Vector3(120, 50, 100);
const BLACK_HOLE_POSITION = PhysicsInfoMap.blackHolePosition; // optional export for reusability

export function setupScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    6000
  );

  // Initial camera position
  camera.position.copy(DEFAULT_CAMERA_OFFSET);
  camera.lookAt(BLACK_HOLE_POSITION);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 50, 50);
  scene.add(directionalLight);

  return { scene, camera, renderer };
}
