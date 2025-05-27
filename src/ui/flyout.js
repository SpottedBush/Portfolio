// File: src/ui/flyout.js
import { stopFollowingPlanet } from '../camera/cameraFollowState.js';
import { planetInfoMap } from '../data/planetData.js';

let flyoutElements = {};

export function initFlyout() {
  document.addEventListener('DOMContentLoaded', () => {
    const flyout = document.getElementById('flyout');
    const title = document.getElementById('flyout-title-text');
    const description = document.getElementById('flyout-description');
    const icon = document.getElementById('flyout-icon');
    const link = document.getElementById('flyout-link');
    const closeBtn = document.getElementById('flyout-close');
    const skills = document.getElementById('flyout-skills');
    const year = document.getElementById('flyout-year');
    const location = document.getElementById('flyout-location');
    const modelReference = document.getElementById('flyout-model-reference');

    if (!flyout || !title || !description || !icon || !link || !closeBtn || !skills || !year || !location || !modelReference) {
      console.error("Flyout elements not found. Make sure flyout.html is loaded.");
      return;
    }

    flyoutElements = { flyout, closeBtn, title, description, icon, link, skills, year, location, modelReference};
    closeBtn.addEventListener('click', closeFlyout);
  });
}

export function openFlyout(planetName) {
  if (!flyoutElements.flyout) return console.warn("Flyout not initialized yet.");

  const data = planetInfoMap[planetName];
  if (!data) {
    console.warn(`No flyout data found for planet: ${planetName}`);
    console.log(planetName);
    return;
  }

  flyoutElements.title.textContent = data.name;
  flyoutElements.description.textContent = data.description;
  flyoutElements.icon.src = data.icon;
  flyoutElements.icon.alt = data.name;
  flyoutElements.link.href = data.link;
  flyoutElements.link.textContent = "View Project";
  flyoutElements.skills.innerHTML = ""; // Clear previous
  flyoutElements.location.textContent = data.location || "";
  
  const rawText = data.modelReference || '';
  const linkedText = rawText.replace( // Convert URLs to links with anchor tags
    /(https?:\/\/[^\s)]+)/g,
    url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
  flyoutElements.modelReference.innerHTML = linkedText;

  if (Array.isArray(data.skills)) {
    data.skills.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      flyoutElements.skills.appendChild(li);
    });
  }

  flyoutElements.year.textContent = data.year ? `Year: ${data.year}` : "";

  if (planetName === "BlackHole") {
    flyoutElements.link.style.display = 'none';
    flyoutElements.year.textContent = "Age: 22 years old";
  }
  if (planetName === "Education"){
    flyoutElements.description.innerHTML = data.description
    .split('\n')
    .map(p => `<p>${p.trim()}</p>`)
    .join('');
    flyoutElements.link.textContent = "View Site";
  }

  if (planetName === "Cdiscount" || planetName === "Pravaig" || planetName === "Kutniti") {
    flyoutElements.link.textContent = "View Site";
  }

  flyoutElements.flyout.classList.add('open');
}

export function closeFlyout() {
  stopFollowingPlanet();
  flyoutElements.flyout.classList.remove('open');
}
