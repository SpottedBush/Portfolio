import { orbitingBodies } from '../scene/loadModels.js';
import { startFollowingPlanet, stopFollowingPlanet } from '../camera/cameraFollowState.js';
import { openFlyout, closeFlyout } from '../ui/flyout.js';
import { planetInfoMap } from '../data/planetData.js';
import { addNewPlanetVisited } from '../ui/achievements/achievementChecker.js';

let currentPlanetIndex = -1;

function getCurrentIndex() {
  return orbitingBodies.findIndex(obj => obj.mesh === currentPlanet);
}

function showPlanetAtIndex(index) {
  let wrappedIndex = (index + orbitingBodies.length) % orbitingBodies.length;
  let name = orbitingBodies[wrappedIndex].name;
  if (name === 'Achievements' && !planetInfoMap[name].skills['Russel ?!'].isDone) { // Check if the Teapot is unlocked
    if (currentPlanetIndex < index) {
      wrappedIndex = (index + orbitingBodies.length + 1) % orbitingBodies.length;
    }
    else {
      wrappedIndex = (index + orbitingBodies.length - 1) % orbitingBodies.length;
    }
  }
  const newPlanet = orbitingBodies[wrappedIndex].mesh;
  name = orbitingBodies[wrappedIndex].name;
  setCurrentPlanet(newPlanet);
  addNewPlanetVisited(name);
  startFollowingPlanet(newPlanet);
  openFlyout(name);
}

export let currentPlanet = null;

export function setCurrentPlanet(mesh) {
  currentPlanet = mesh;
  currentPlanetIndex = getCurrentIndex();
}

document.addEventListener('keydown', (e) => {
  if (!currentPlanet) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        showPlanetAtIndex(-1);
    }
    return;
  }
    if (e.key === 'Escape') {
        currentPlanet = null;
        currentPlanetIndex = -1;
        stopFollowingPlanet();
        closeFlyout();
        return;
      }

    else if (e.key === 'ArrowRight') {
        showPlanetAtIndex(currentPlanetIndex - 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'Enter') {
        showPlanetAtIndex(currentPlanetIndex + 1);
    }
});
