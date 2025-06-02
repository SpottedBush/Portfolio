// File: src/scene/animationLoop.js
import * as THREE from 'three';
import { animatedMixers, rotatingModels, orbitingBodies } from './loadModels.js';
import { updateCameraFollowing } from '../camera/cameraFollowState.js';
import { PhysicsInfoMap } from '../data/physicsData.js';
import { rocketShipState, updateSmoke } from '../ui/achievements/rocketShip.js';

const blackHolePosition = PhysicsInfoMap.blackHolePosition.clone();
const G = PhysicsInfoMap.G;
const M = PhysicsInfoMap.M;
const drag = PhysicsInfoMap.drag;
let maxTrailLength = PhysicsInfoMap.maxTrailLength ?? 150;

let isPaused = false;
const fixedDt = 1 / 60; // 60 FPS fixed physics timestep in seconds
document.addEventListener("visibilitychange", () => {
  isPaused = document.hidden;
});


export function animate(scene, camera, renderer) {

  // Start physics loop
  setInterval(() => { // Handling this way avoid the need for requestAnimationFrame
    if (!isPaused) {
      updateOrbitingBodies(fixedDt);
    }
  }, fixedDt * 1000); // in milliseconds

  function updateRotations() {
    rotatingModels.forEach(({ model, rotSpeed, modelFile }) => {
      if (modelFile === 'planets/black_hole.glb') {
        model.rotation.y -= rotSpeed;
      }
      else if (modelFile === 'planets/telescope.glb'
        || modelFile === 'planets/binoculars.glb'
        || modelFile === 'planets/suv.glb'
        || modelFile === 'planets/c_planet.glb'
        || modelFile === 'planets/enchanted_book.glb') {
        model.rotation.y += rotSpeed;
      }
      else {
        model.rotation.x += rotSpeed;
        model.rotation.y += rotSpeed;
      }
    });
  }

  function updateOrbitingBodies(deltaTime) {
    orbitingBodies.forEach((body) => {
      const { mesh, velocity } = body;
      if (body.name === 'RocketShip') {
        mesh.position.add(velocity.clone().multiplyScalar(deltaTime));
        if (body.trail) {
          updateTrail(scene, body);
        }
        return;
      }
      if (mesh.position === undefined) {
        console.warn(`Body ${body.name} does not have a position defined.`);
        return;
      }
      const pos = mesh.position;
      const dir = new THREE.Vector3().subVectors(blackHolePosition, pos);
      const distanceSq = dir.lengthSq();
      const forceMag = (G * M) / distanceSq;
      const acceleration = dir.normalize().multiplyScalar(forceMag);

      // Integrate velocity and position
      velocity.add(acceleration.multiplyScalar(deltaTime));
      velocity.multiplyScalar(drag); // Simulate drag
      pos.add(velocity.clone().multiplyScalar(deltaTime));

      // Update orbit trail
      if (body.trail) {
        updateTrail(scene, body);
      }
    });
  }

  function updateTrail(scene, body) {
    if (body.name === 'RocketShip') {
      maxTrailLength = 100; // For RocketShip, we use a shorter trail
    }
    const { mesh, trail } = body;
    trail.push(mesh.position.clone());
    if (trail.length > maxTrailLength) {
      trail.shift();
    }

    if (body.trailLine) {
      scene.remove(body.trailLine);
      body.trailLine.geometry.dispose();
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(trail);
    let material;
    const color = body.trailLineColor ?? 0xffffff;

    if (Array.isArray(color)) {
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
      material = new THREE.LineBasicMaterial({ vertexColors: true });
      material.linewidth = 50;
    } else {
      material = new THREE.LineBasicMaterial({ color });
    }
    const line = new THREE.Line(geometry, material);

    body.trailLine = line;
    scene.add(line);

    body.trail.push(mesh.position.clone());
    if (body.trail.length > maxTrailLength) {
      body.trail.shift();
    }
    maxTrailLength = PhysicsInfoMap.maxTrailLength ?? 150;
  }

  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);

    if (window.orbitControls) { // But it should not exists... Right? ;)
      window.orbitControls.update();
    }
    const delta = clock.getDelta();
    animatedMixers.forEach((mixer) => mixer.update(delta));
    updateRotations();
    updateCameraFollowing(camera);
    if (rocketShipState.isBoostUnlocked) {
      updateSmoke(delta); // Update smoke particles every frame
    }
    renderer.render(scene, camera);
  }

  loop();
}
