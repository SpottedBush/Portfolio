import { setupScene } from './scene/setupScene.js';
import { loadModels, clickableObjects, meshToModelMap } from './scene/loadModels.js';
import { animate } from './scene/animationLoop.js';
import { startFollowingPlanet } from './camera/cameraFollowState.js';
import { initFlyout, openFlyout } from './ui/flyout.js';
import { setCurrentPlanet } from './camera/navigation.js';
import * as THREE from 'three';

initFlyout();

const { scene, camera, renderer } = setupScene();
loadModels(scene);
animate(scene, camera, renderer);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    const planetModel = meshToModelMap.get(clickedMesh);
    if (!planetModel) {
      console.warn("Clicked mesh doesn't map to a planet model");
      return;
    }
    setCurrentPlanet(clickedMesh.name);
    startFollowingPlanet(planetModel);
    openFlyout(clickedMesh.name);
  }
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update camera aspect and projection
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
}

window.addEventListener('click', onClick);
window.addEventListener('resize', onWindowResize);

window.onFlyoutClosed = () => {
  document.querySelector('#flyout button').addEventListener('click', () => {
  stopFollowing(camera);
});}