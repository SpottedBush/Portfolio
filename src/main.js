import { setupScene } from './scene/setupScene.js';
import { loadModels, clickableObjects, meshToModelMap, orbitingBodies } from './scene/loadModels.js';
import { animate } from './scene/animationLoop.js';
import { startFollowingPlanet, stopFollowingPlanet } from './camera/cameraFollowState.js';
import { initFlyout, openFlyout } from './ui/flyout.js';
import { setCurrentPlanet } from './camera/navigation.js';
import * as THREE from 'three';
import { planetInfoMap } from './data/planetData.js';
import { showAchievementNotification } from './ui/achievements/achievementsNotificationFlyout.js';
import { addNewPlanetVisited, checkHexClientAchievement, checkCTAAchievement, listenForKonamiCode } from './ui/achievements/achievementChecker.js';
import { rocketShipState } from './ui/achievements/rocketShip.js';

initFlyout();

const { scene, camera, renderer } = setupScene();
loadModels(scene);
animate(scene, camera, renderer);

export const raycaster = new THREE.Raycaster();
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
    if (clickedMesh.name === 'RocketShip') {
      rocketShipState.isRocketShipFollowed = true;
    }
    else if (clickedMesh.name === 'BlackHole') {
      rocketShipState.isRocketShipFollowed = false;
      stopFollowingPlanet();

    }
    else if (clickedMesh.name === 'HexClient') {
      checkHexClientAchievement();
    }
    else if (clickedMesh.name === 'Achievements' && !planetInfoMap[clickedMesh.name].skills['Russel ?!'].isDone)
    {
      planetInfoMap[clickedMesh.name].skills['Russel ?!'].isDone = true; // Unlock the Teapot
      orbitingBodies.forEach(body => {
        if (body.name === 'Achievements') {
          body.trail = []; // Make the Teapot visible
          showAchievementNotification('Russel ?!');
        }
      });
    }
    setCurrentPlanet(clickedMesh.name);
    addNewPlanetVisited(clickedMesh.name);
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


listenForKonamiCode();
document.addEventListener("DOMContentLoaded", () => {
  const socialLinks = document.querySelectorAll('.social-links a');

  socialLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const title = link.getAttribute('aria-label');
      checkCTAAchievement(title);
    });
  });
});