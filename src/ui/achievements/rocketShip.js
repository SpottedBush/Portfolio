import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { addHitbox } from "../../scene/loadModels";
import { startFollowingPlanet } from "../../camera/cameraFollowState";
import { closeFlyout } from "../flyout";
import { PhysicsInfoMap } from "../../data/physicsData";
import { orbitingBodies, clickableObjects, meshToModelMap } from "../../scene/loadModels";
import { checkSpaceLoverAchievement } from "./achievementChecker";

export const rocketShipState = { isRocketShipFollowed: false, traveledDistance: 0, isBoostActive: false, isBoostUnlocked: false };
export function giveKonamiCodeReward() {
    const loader = new GLTFLoader();
    loader.load("planets/spaceShip.glb", (gltf) => {
        const rocket = gltf.scene;
        rocket.position.set(50, 25, 150);
        rocket.name = "RocketShip";
        rocket.scale.set(2.5, 2.5, 2.5);
        window.scene.add(rocket);
        // Rainbow colors
        const colors = [];

        for (let i = 0; i < PhysicsInfoMap.maxTrailLength; i++) {
            const t = i / PhysicsInfoMap.maxTrailLength;
            const color = new THREE.Color(`hsl(${(t * 360)}, 100%, 50%)`);
            colors.push(color.r, color.g, color.b);
        }
        orbitingBodies.push({
            mesh: rocket,
            name: "RocketShip",
            trail: [],
            trailLine: new THREE.Line(),
            velocity: new THREE.Vector3(0, 0, 0),
            trailLineColor: colors,
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
        closeFlyout();
        rocketShipState.isRocketShipFollowed = true;
        startFollowingPlanet(rocket);
        // WASD controls
        const move = {};
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
                case "KeyF": move.rotateDown = true; break; // I am a psycho, using f for crouching :)
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
                case "KeyF": move.rotateDown = false; break; // I am a psycho, using f for crouching :)
            }
        }

        function animateRocket() {
            if (rocketShipState.isRocketShipFollowed) {
                checkSpaceLoverAchievement();
                // Add acceleration to velocity instead of direct translation
                const maxAcceleration = 0.05;
                const velocity = orbitingBodies.find(b => b.mesh === rocket).velocity;

                if (move.forward) {
                    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rocket.quaternion);
                    velocity.add(forward.multiplyScalar(maxAcceleration));
                    rocketShipState.traveledDistance += maxAcceleration;
                }
                if (move.backward) {
                    const backward = new THREE.Vector3(0, 0, -1).applyQuaternion(rocket.quaternion);
                    velocity.add(backward.multiplyScalar(maxAcceleration));
                    rocketShipState.traveledDistance += maxAcceleration;
                }
                rocket.position.add(velocity);
                velocity.multiplyScalar(0.98);
                if (move.left) rocket.rotateY(rotationSpeed)
                if (move.right) rocket.rotateY(-rotationSpeed)
                if (move.rotateRight) rocket.rotateZ(rotationSpeed)
                if (move.rotateLeft) rocket.rotateZ(-rotationSpeed)
                if (move.rotateUp) rocket.rotateX(-rotationSpeed)
                if (move.rotateDown) rocket.rotateX(rotationSpeed)
            }
            requestAnimationFrame(animateRocket);
        }
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        animateRocket();
    });
}
export function giveSpaceLoverReward() {
    rocketShipState.isBoostUnlocked = true;
    let lastWPress = 0;
    let wPressCount = 0;
    let body = orbitingBodies.find(b => b.name === "RocketShip");
    let rocketRef = body.mesh;

    function onKeyDownBoost(e) {
        if (!rocketRef) return;
        if (e.code === "KeyW") {
            const now = performance.now();
            if (now - lastWPress < 100) {
                wPressCount++;
            }
            if (wPressCount >= 2 && !rocketShipState.isBoostActive) {
                rocketShipState.isBoostActive = true;
            }
        }
    }

    function onKeyUpBoost(e) {
        if (!rocketRef) return;
        if (e.code === "KeyW" && !rocketShipState.isBoostActive) {
            wPressCount++;
            lastWPress = performance.now();
        }
        if (e.code === "KeyW" && rocketShipState.isBoostActive) {
            rocketShipState.isBoostActive = false;
            wPressCount = 0;
        }
    }
    const clock = new THREE.Clock();
    function animateBoost() {
        const body = orbitingBodies.find(b => b.mesh === rocketRef);
        if (rocketShipState.isBoostActive && rocketRef) {
            if (body && rocketShipState.isBoostActive) {
                const boostVec = new THREE.Vector3(0, 0, 1).applyQuaternion(rocketRef.quaternion);
                body.velocity.add(boostVec.multiplyScalar(0.15));
            }
            const delta = clock.getDelta();
            addSmokeParticle(rocketRef.position.clone()); // Add smoke particle on boost
        }
        requestAnimationFrame(animateBoost);
    }
    if (rocketRef) {
        window.addEventListener("keydown", onKeyDownBoost);
        window.addEventListener("keyup", onKeyUpBoost);
        animateBoost();
    }
}

// ------ SMOKE PARTICLES ------ //
const textureLoader = new THREE.TextureLoader();
const smokeTexture = textureLoader.load('misc/rainbow_smoke.png');
const maxParticles = 100;
const positions = new Float32Array(maxParticles * 3);
const colors = new Float32Array(maxParticles * 3);
const sizes = new Float32Array(maxParticles);
const opacities = new Float32Array(maxParticles);
const lifetimes = new Float32Array(maxParticles);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

const material = new THREE.ShaderMaterial({
    vertexShader: `
    attribute float size;
    attribute float opacity;
    varying float vOpacity;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vOpacity = opacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z); // Perspective scale
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    fragmentShader: `
    uniform sampler2D pointTexture;
    varying vec3 vColor;
    varying float vOpacity;
    void main() {
      vec4 texColor = texture2D(pointTexture, gl_PointCoord);
      gl_FragColor = vec4(vColor, vOpacity) * texColor;
    }
  `,
    uniforms: {
        pointTexture: { value: smokeTexture }
    },
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});


let smokePoints = new THREE.Points(geometry, material);
let particleIndex = 0;
export function addSmokeParticle(position) {
    smokePoints = new THREE.Points(geometry, material);
    window.scene.add(smokePoints);
    const i3 = particleIndex * 3;

    // Position
    positions[i3 + 0] = position.x;
    positions[i3 + 1] = position.y;
    positions[i3 + 2] = position.z;

    // Rainbow color via HSL interpolation
    const hue = (Date.now() * 0.05 + particleIndex * 10) % 360 / 360;
    const color = new THREE.Color().setHSL(hue, 1.0, 0.5);
    colors[i3 + 0] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[particleIndex] = 25.0;
    opacities[particleIndex] = 1.0;
    lifetimes[particleIndex] = 2.0;

    particleIndex = (particleIndex + 1) % maxParticles;
}

export function updateSmoke(deltaTime) {
    for (let i = 0; i < maxParticles; i++) {
        if (lifetimes[i] > 0) {
            lifetimes[i] -= deltaTime;
            opacities[i] = lifetimes[i];             // Fade out
            sizes[i] *= 0.95;                        // Shrink slightly
        } else {
            lifetimes[i] = 0;
            sizes[i] = 0;
            opacities[i] = 0;
        }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    geometry.attributes.opacity.needsUpdate = true;
}

export function removeSmoke() {
    if (window.scene && smokePoints) {
        window.scene.remove(smokePoints);
        smokePoints.geometry.dispose();
        smokePoints.material.dispose();
        smokePoints = null;
    }
}
