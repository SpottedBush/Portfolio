import { orbitingBodies, meshToModelMap } from '../scene/loadModels.js';
import { startFollowingPlanet, stopFollowingPlanet } from '../camera/cameraFollowState.js';
import { openFlyout, closeFlyout } from '../ui/flyout.js';

let currentPlanetIndex = -1;

function getCurrentIndex() {
  return orbitingBodies.findIndex(obj => obj.mesh === currentPlanet);
}

function showPlanetAtIndex(index) {
  const wrappedIndex = (index + orbitingBodies.length) % orbitingBodies.length;
  const newPlanet = orbitingBodies[wrappedIndex].mesh;
  const name = orbitingBodies[wrappedIndex].name;

  currentPlanet = newPlanet;
  currentPlanetIndex = wrappedIndex;
  startFollowingPlanet(currentPlanet);
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
    } else if (e.key === 'ArrowLeft' || e.key === 'Enter' || e.key === ' ') {
        showPlanetAtIndex(currentPlanetIndex + 1);
    }
});
