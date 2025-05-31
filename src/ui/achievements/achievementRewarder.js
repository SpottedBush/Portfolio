import { addMusicPlayer } from "./musicPlayerUi";
import { clickableObjects, meshToModelMap, orbitingBodies } from "../../scene/loadModels";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { check100PercentAchievement } from "./achievementChecker";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { addHitbox } from "../../scene/loadModels";

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
    controls.minDistance = 1;
    controls.maxDistance = 1000;
    window.orbitControls = controls;
    return controls;
}

function addHoveringListeners() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function checkAndUpdateCursorHovering(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, window.camera); // Assumes a global camera variable
        const intersects = raycaster.intersectObjects(clickableObjects, true);
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            document.body.style.cursor = `url(cursor/LoL_hover.cur), auto`;
        } else {
            document.body.style.cursor = `url(cursor/LoL.cur), auto`;
        }
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

function giveKonamiCodeReward() {
    const loader = new GLTFLoader();
    loader.load("planets/spaceShip.glb", (gltf) => {
        const rocket = gltf.scene;
        rocket.position.set(50, 25, 150);
        rocket.name = "RocketShip";
        rocket.scale.set(2.5, 2.5, 2.5);
        window.scene.add(rocket);
        orbitingBodies.push({
            mesh: rocket,
            name: "RocketShip",
            trail: [],
            trailLine: new THREE.Line(),
            velocity: new THREE.Vector3(0, 0, 0),
            trailLineColor: null,
        });

        rocket.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.name = "RocketShip";

                clickableObjects.push(child);             // For raycasting
                meshToModelMap.set(child, rocket);         // Track parent model
            }
        });
        addHitbox(rocket, "RocketShip");

        // WASD controls
        const move = { };
        const rotationSpeed = 0.04;

        function onKeyDown(e) {
            switch (e.code) {
            case "KeyW": move.forward = true; break;
            case "KeyS": move.backward = true; break;
            case "KeyA": move.left = true; break;
            case "KeyD": move.right = true; break;
            case "KeyQ": move.rotateLeft = true; break;
            case "KeyE": move.rotateRight = true; break;
            case "Space": move.rotateUp = true; break;
            case "ShiftLeft":
            case "ShiftRight":
                move.rotateDown = true;
                break;
            case "KeyF": move.rotateDown = true; break;
            }
        }
        function onKeyUp(e) {
            switch (e.code) {
            case "KeyW": move.forward = false; break;
            case "KeyS": move.backward = false; break;
            case "KeyA": move.left = false; break;
            case "KeyD": move.right = false; break;
            case "KeyQ": move.rotateLeft = false; break;
            case "KeyE": move.rotateRight = false; break;
            case "Space": move.rotateUp = false; break;
            case "ShiftLeft":
            case "ShiftRight":
                move.rotateDown = false;
                break;
            case "KeyF": move.rotateDown = false; break;
            }
        }

        function animateRocket() {
            // Add acceleration to velocity instead of direct translation
            const maxAcceleration = 0.05;
            const velocity = orbitingBodies.find(b => b.mesh === rocket).velocity;

            if (move.forward) {
                // Forward in local Z
                const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rocket.quaternion);
                velocity.add(forward.multiplyScalar(maxAcceleration));
            }
            if (move.backward) {
                const backward = new THREE.Vector3(0, 0, -1).applyQuaternion(rocket.quaternion);
                velocity.add(backward.multiplyScalar(maxAcceleration));
            }
            rocket.position.add(velocity);
            velocity.multiplyScalar(0.98);
            if (move.left) rocket.rotateY(rotationSpeed) 
            if (move.right) rocket.rotateY(-rotationSpeed)
            if (move.rotateRight) rocket.rotateZ(rotationSpeed)
            if (move.rotateLeft) rocket.rotateZ(-rotationSpeed)
            if (move.rotateUp) rocket.rotateX(rotationSpeed)
            if (move.rotateDown) rocket.rotateX(-rotationSpeed)
            requestAnimationFrame(animateRocket);
        }
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        animateRocket();
    });
}

export function give100PercentAchievement() {
    setTimeout(() => {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', "noopener,noreferrer");
    }, 4000);
}

export function giveAchievementReward(achievementName) { // name2reward
    check100PercentAchievement();
    switch (achievementName) {
        case 'Russel ?!':
            return; // This is handled in main.js because it requires a specific mesh interaction (adding trail)
        case 'Around the world':
            break;
        // return addMusicPlayer();
        case 'Konami Code':
            return giveKonamiCodeReward();
        case 'Biggest fan (CTA)':
            return addOrbitControls();
        case 'It won\'t open...':
            return setCursorToIcon();
        case 'Space Lover':
            console.log('Achievement: Space Lover');
            break;
        case '100%':
            give100PercentAchievement();
            break;
        default:
            console.warn(`No reward defined for achievement: ${achievementName}`);
            return;
    }
}