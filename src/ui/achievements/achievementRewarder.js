import { addMusicPlayer } from "./musicPlayerUi";
import { clickableObjects } from "../../scene/loadModels";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { check100PercentAchievement } from "./achievementChecker";
import { giveKonamiCodeReward, giveSpaceLoverReward } from "./rocketShip";
import { planetInfoMap } from "../../data/planetData";

function addOrbitControls() {
    camera = window.camera;
    renderer = window.renderer;
    if (!camera || !renderer) {
        console.warn("Camera or renderer not found. Please ensure they are initialized before calling addOrbitControls.");
        return null;
    }

    if (window.orbitControls) {
        return window.orbitControls;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 85;
    controls.maxDistance = 1000;

    // Disable right mouse button (context menu and OrbitControls panning)
    controls.mouseButtons.RIGHT = null;

    window.orbitControls = controls;
    return controls;
}

function addHoveringListeners() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function checkAndUpdateCursorHovering(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, window.camera);

        const intersects = raycaster.intersectObjects(clickableObjects, true);
        const hoveredElem = document.elementFromPoint(event.clientX, event.clientY);

        let shouldHover = false;

        // 3D object hover
        if (intersects.length > 0) {
            shouldHover = true;
        }

        // DOM element hover
        if (hoveredElem) {
            const isInsideLink = hoveredElem.closest('a[href]'); // Checks parent chain for links
            if (isInsideLink !== null) { // Doesn't work on Ubuntu config...
                shouldHover = true;
            }
        }
        document.body.style.cursor = shouldHover
            ? `url(cursor/LoL_hover.cur), auto`
            : `url(cursor/LoL.cur), auto`;
    }

    function animateCursor() {
        checkAndUpdateCursorHovering({ clientX: window.lastMouseX || 0, clientY: window.lastMouseY || 0 });
        requestAnimationFrame(animateCursor);
    }

    window.addEventListener('mousemove', (event) => {
        window.lastMouseX = event.clientX;
        window.lastMouseY = event.clientY;
    }, false);

    animateCursor();
}

export function setCursorToIcon() {
    const iconPath = `cursor/LoL.cur`;
    document.body.style.cursor = `url('${iconPath}'), auto`;
    addHoveringListeners();
}

export function give100PercentAchievement() {
    setTimeout(() => {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', "noopener,noreferrer");
    }, 4000); // I am sorry, I had to.
}

export function giveAchievementReward(achievementName) { // name2reward
    switch (achievementName) {
        case 'Russel ?!':
            break; // This is handled in main.js because it requires a specific mesh interaction (adding trail)
        case 'Around the world':
            // planetInfoMap['Achievements'].skills['Around the world'].isDone = true;
            addMusicPlayer();
            break;
        case 'Konami Code':
            giveKonamiCodeReward();
            break;
        case 'Biggest fan (CTA)':
            addOrbitControls();
            break;
        case 'It won\'t open...':
            setCursorToIcon();
            break;
        case 'Space Lover':
            giveSpaceLoverReward();
            break;
        case '100%':
            give100PercentAchievement();
            break;
        default:
            console.warn(`No reward defined for achievement: ${achievementName}`);
            return;
    }
    check100PercentAchievement();

}