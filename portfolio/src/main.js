import { setupScene } from './scene/setupScene.js';
import { loadModels, clickableObjects, meshToModelMap } from './scene/loadModels.js';
import { animate } from './scene/animationLoop.js';
import { startFollowingPlanet } from './camera/cameraFollowState.js';
import { setupControls } from './scene/orbitControls.js';
import { setupInfoPanel } from './ui/infoPanel.js';
import { initFlyout, openFlyout } from './ui/flyout.js';
import { setCurrentPlanet } from './camera/navigation.js';
import * as THREE from 'three';

initFlyout();

const { scene, camera, renderer } = setupScene();
setupControls(camera, renderer);
setupInfoPanel();
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
window.addEventListener('click', onClick);


window.onFlyoutClosed = () => {
  document.querySelector('#flyout button').addEventListener('click', () => {
  stopFollowing(camera);
});}