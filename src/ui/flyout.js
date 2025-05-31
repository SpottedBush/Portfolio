// File: src/ui/flyout.js
import { stopFollowingPlanet } from '../camera/cameraFollowState.js';
import { planetInfoMap } from '../data/planetData.js';
import { displayAchievements } from './achievements/achievementListFlyout.js';

export let flyoutElements = {};

export function initFlyout() {
  document.addEventListener('DOMContentLoaded', () => {
    const flyout = document.getElementById('flyout');
    const title = document.getElementById('flyout-title-text');
    const description = document.getElementById('flyout-description');
    const icon = document.getElementById('flyout-icon');
    const link = document.getElementById('flyout-link');
    const closeBtn = document.getElementById('flyout-close');
    const skillLabel = document.getElementById('flyout-skills-label');
    const skills = document.getElementById('flyout-skills');
    const year = document.getElementById('flyout-year');
    const location = document.getElementById('flyout-location');
    const modelReference = document.getElementById('flyout-model-reference');

    if (!flyout || !title || !description || !icon || !link || !closeBtn || !skillLabel ||
      !skills || !year || !location || !modelReference) {
      console.error("Flyout elements not found. Make sure flyout.html is loaded.");
      return;
    }

    flyoutElements = { flyout, closeBtn, title, description, icon, link, skillLabel, skills, year, location, modelReference};
    closeBtn.addEventListener('click', closeFlyout);
  });
}

export function openFlyout(planetName) {
  if (!flyoutElements.flyout) return console.warn("Flyout not initialized yet.");
  const data = planetInfoMap[planetName];
  if (planetName === "Achievements" && !data.skills['Russel ?!'].isDone) {
    return;
  }
  if (!data) {
    flyoutElements.flyout.classList.remove('open');
    return;
  }

  if (planetName === "Achievements" && data.skills['Russel ?!'].isDone) {
    displayAchievements(data); // Russel ?! Achievement
    return;
  }

  flyoutElements.title.textContent = data.name;
  flyoutElements.description.textContent = data.description;
  flyoutElements.icon.src = data.icon;
  flyoutElements.icon.alt = data.name;
  flyoutElements.icon.style.width = "300px";
  flyoutElements.icon.style.height = "300px";
  flyoutElements.icon.style.objectFit = "contain";
  flyoutElements.icon.style.margin = "0 auto";
  flyoutElements.link.style.display = 'block';
  flyoutElements.link.innerHTML = `<a href="${data.link}" target=\"_blank\" rel=\"noopener noreferrer\">View Project</a>`;
  flyoutElements.skills.innerHTML = ""; // Clear previous
  flyoutElements.location.textContent = data.location || "";
  flyoutElements.skillLabel.textContent = "Skills:";
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
  }

  if (planetName === "Cdiscount" || planetName === "Pravaig" || planetName === "Kutniti" || planetName === "Education") {
    flyoutElements.link.innerHTML = `<a href="${data.link}" target=\"_blank\" rel=\"noopener noreferrer\">View Site</a>`;;
  }
  flyoutElements.flyout.classList.add('open');
}

export function closeFlyout() {
  stopFollowingPlanet();
  flyoutElements.flyout.classList.remove('open');
}
