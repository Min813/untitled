import * as THREE from 'three'(any);

// Variables for movement
let walkSpeed = 5;
let runSpeed = 8;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let gravity = -9.81;
let isGrounded = false;

// Variables for camera and control
let camera, scene, renderer;
let player, controls;

function init() {
    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.6; // Approximate height of a person

    // Add a simple ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Lay flat on the X axis
    scene.add(ground);

    // Set up the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create the player (simple box for now)
    const playerGeometry = new THREE.BoxGeometry(1, 1.8, 1); // Size of a person
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1; // Stand above the ground
    scene.add(player);

    // Set up controls (pointer lock for first-person movement)
    controls = new THREE.PointerLockControls(camera, document.body);
    document.addEventListener('click', () => {
        controls.lock();
    });

    // Movement input
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Game loop
    animate();
}

// Movement control variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Apply movement
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize(); // Ensure consistent speed in all directions

    if (controls.isLocked) {
        const delta = 0.1; // Frame time factor

        if (isGrounded) {
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
        }

        // Apply the direction to the velocity
        if (moveForward || moveBackward) velocity.z -= direction.z * walkSpeed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * walkSpeed * delta;

        // Move the player
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
    }

    renderer.render(scene, camera);
}

// Initialize the game scene
init();
