import { planetInfoMap } from './data/planetData.js';
import { setupScene } from './scene/setupScene.js';
import { loadModels, clickableObjects } from './scene/loadModels.js';
import { animate } from './scene/animationLoop.js';
import { setupControls } from './scene/orbitControls.js';
import { setupInfoPanel } from './ui/infoPanel.js';
import { flyout } from './ui/infoFlyout.js';
import * as THREE from 'three';

const { scene, camera, renderer } = setupScene();
setupControls(camera, renderer);
setupInfoPanel();
loadModels(scene);
animate(scene, camera, renderer);

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedPlanet = null;

// Mouse click handler
function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const info = planetInfoMap[clicked.name];
    if (info) {
      selectedPlanet = clicked;
      flyout.show(info);
    }
  }
}

window.addEventListener('click', onClick);

// When flyout closes, clear selected planet
flyout.onClose = () => {
  selectedPlanet = null;
};

// Animate loop with flyout position update
function animateLoop() {
  requestAnimationFrame(animateLoop);

  if (selectedPlanet) {
    flyout.updatePosition(selectedPlanet.position, camera, renderer);
  }

  renderer.render(scene, camera);
}

animateLoop();