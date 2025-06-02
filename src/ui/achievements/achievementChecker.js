import { plane } from "three/examples/jsm/Addons.js";
import { planetInfoMap } from "../../data/planetData";
import { orbitingBodies } from "../../scene/loadModels";
import { showAchievementNotification } from "./achievementsNotificationFlyout";
import { rocketShipState } from "./rocketShip";

const planetVisitedSet = new Set();
const totalNbPlanets = Object.entries(planetInfoMap).length;

export function addNewPlanetVisited(planetName) {
    if (planetInfoMap['Achievements'].skills['Around the world'].isDone ||
        planetVisitedSet.has(planetName))
        return;


    planetVisitedSet.add(planetName);
    let nbPlanetVisited = planetVisitedSet.size;
    if (nbPlanetVisited >= totalNbPlanets) {
        showAchievementNotification('Around the world');
    }
}

let nbClicks = 0;
export function checkHexClientAchievement() {
    const hexClientAchievement = planetInfoMap['Achievements'].skills['It won\'t open...'];
    if (hexClientAchievement.isDone) return;
    nbClicks++;
    if (nbClicks >= 4) { // FOUR
        hexClientAchievement.isDone = true;
        showAchievementNotification('It won\'t open...');
    }
}

const CTAVisitedSet = new Set();
const totalNbCTA = 5;

export function checkCTAAchievement(CTAName) {
    if (planetInfoMap['Achievements'].skills['Biggest fan (CTA)'].isDone ||
        CTAVisitedSet.has(CTAName))
        return;

    CTAVisitedSet.add(CTAName);
    let nbCTAVisited = CTAVisitedSet.size;
    if (nbCTAVisited >= totalNbCTA) {
        showAchievementNotification('Biggest fan (CTA)');
    }
}

const konamiCode = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
];

export function listenForKonamiCode() {
    const achievement = planetInfoMap['Achievements'].skills['Konami Code'];
    if (achievement.isDone) return;
    let currentIndex = 0;

    function keyHandler(e) {
        const key = e.key.toLowerCase(); // Normalize to lowercase
        const expectedKey = konamiCode[currentIndex].toLowerCase();

        if (key === expectedKey) {
            currentIndex++;
            if (currentIndex === konamiCode.length) {
                currentIndex = 0; // reset
                achievement.isDone = true;
                showAchievementNotification('Konami Code');
            }
        }
        else {
            currentIndex = 0; // reset if the key doesn't match
        }
    }
    window.addEventListener("keydown", keyHandler);
}

export function checkSpaceLoverAchievement() {
    const achievement = planetInfoMap['Achievements'].skills['Space Lover'];
    if (achievement.isDone) return;
    let rocket = orbitingBodies.find(body => body.name === 'RocketShip');
    if (!rocket) {
        console.warn("RocketShip not found in orbiting bodies");
        return;
    }
    if (rocketShipState.traveledDistance >= 30) {
        achievement.isDone = true;
        showAchievementNotification('Space Lover');
    }
}

export function check100PercentAchievement() {
    const achievement = planetInfoMap['Achievements'].skills['100%'];
    if (achievement.isDone) return;
    const achievements = planetInfoMap['Achievements'].skills;
    for (const skill in achievements) {
        if (!achievements[skill].isDone && skill !== '100%') {
            return; // If any skill is not done, we can't have 100%
        }
    }
    achievement.isDone = true;
    showAchievementNotification('100%');
}