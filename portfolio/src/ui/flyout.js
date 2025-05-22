// File: src/ui/flyout.js
import { stopFollowingPlanet } from '../camera/cameraFollowState.js';
import { planetInfoMap } from '../data/planetData.js';

let flyoutElements = {};

export function initFlyout() {
  document.addEventListener('DOMContentLoaded', () => {
    const flyout = document.getElementById('flyout');
    const title = document.getElementById('flyout-title');
    const description = document.getElementById('flyout-description');
    const icon = document.getElementById('flyout-icon');
    const link = document.getElementById('flyout-link');
    const closeBtn = document.getElementById('flyout-close');

    if (!flyout || !title || !description || !icon || !link || !closeBtn) {
      console.error("Flyout elements not found. Make sure flyout.html is loaded.");
      return;
    }

    flyoutElements = { flyout, title, description, icon, link };
    closeBtn.addEventListener('click', closeFlyout);
  });
}

export function openFlyout(planetName) {
  if (!flyoutElements.flyout) return console.warn("Flyout not initialized yet.");

  const data = planetInfoMap[planetName];
  if (!data) {
    console.warn(`No flyout data found for planet: ${planetName}`);
    return;
  }

  flyoutElements.title.textContent = data.name;
  flyoutElements.description.textContent = data.description;
  flyoutElements.icon.src = data.icon;
  flyoutElements.icon.alt = data.name;
  flyoutElements.link.href = data.link;
  flyoutElements.link.textContent = "View Project";

  flyoutElements.flyout.classList.add('open');
}

export function closeFlyout() {
  stopFollowingPlanet();
  flyoutElements.flyout.classList.remove('open');
}
