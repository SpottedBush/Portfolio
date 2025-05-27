import * as THREE from 'three';

export const PhysicsInfoMap = {
    blackHolePosition : new THREE.Vector3(0, 0, 0),
    G : 10,         // Tweaked gravitational constant
    M : 1000,       // Mass of black hole
    maxAccel : 10000, // Clamp acceleration for stability
    drag : 1,   // Slight damping to stabilize orbits
    maxTrailLength : 500, // Maximum length of the trail
}