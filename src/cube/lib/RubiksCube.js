import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import Cube from './Cube';

// RubiksCube class that manages a 3D Rubik's Cube
export default class RubiksCube {
  // Constructor for initializing the Rubik's Cube
  constructor() {
    this.scale = 20; // Scale factor for the cube
    this.epsilon = 0.5; // A small threshold for floating-point comparisons
    this.selectedCube = null; // Placeholder for the selected cube
    this.rubiksCubeGroup = new THREE.Group(); // Group to hold all the cubes in the Rubik's Cube
    this.rubiksCubeGroup.scale.set(this.scale, this.scale, this.scale); // Scale the Rubik's Cube

    // Set initial rotation of the Rubik's Cube group
    this.rubiksCubeGroup.rotation.set(Math.PI / 7, -Math.PI / 4, 0);
    
    // Initialize the cubes that make up the Rubik's Cube
    this.initializeRubiksCube();

    // Start the animation loop for smooth transitions using TWEEN.js
    const anim = (t) => {
      TWEEN.update(t); // Update tweens
      requestAnimationFrame(anim); // Continuously call the animation function
    };
    anim(); // Begin the animation loop

    // Add event listener for keyboard input to handle cube rotations
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  // Function to initialize the Rubik's Cube by creating the individual cubes
  initializeRubiksCube() {
    this.cubes = []; // Array to store the individual cubes
    let count = 0;
    for (let i = -1; i <= 1; i++) { // Iterate through x-axis positions (-1, 0, 1)
      for (let j = -1; j <= 1; j++) { // Iterate through y-axis positions (-1, 0, 1)
        for (let k = -1; k <= 1; k++) { // Iterate through z-axis positions (-1, 0, 1)
          // Create a new Cube object at the position (i, j, k)
          this.cubes[count] = new Cube(i, j, k);
          this.rubiksCubeGroup.add(this.cubes[count].cubeGroup); // Add the cube's group to the Rubik's Cube
          count++; // Increment counter to keep track of cubes
        }
      }
    }
    // Set the default selected cube (the first cube)
    this.selectedCube = this.cubes[0];
  }

  // Function to rotate a group of cubes around a given axis
  rotateAroundWorldAxis(cubeGroup, axis) {
    // Prevent rotation if the group is already rotating
    if (cubeGroup.isRotating) return;

    const start = { rotation: 0 }; // Start rotation angle (initially 0)
    const prev = { rotation: 0 }; // Previous rotation angle to track changes
    const end = { rotation: Math.PI / 2 }; // End rotation angle (90 degrees)
    cubeGroup.isRotating = true; // Flag to indicate rotation in progress

    // Create a tween for smooth rotation animation using TWEEN.js
    const tween = new TWEEN.Tween(start)
      .to(end, 300) // Rotate to 90 degrees over 300ms
      .easing(TWEEN.Easing.Quadratic.InOut) // Apply easing for smooth animation
      .onUpdate(({ rotation }) => {
        // Update the position and rotation of the cube group
        cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);
        cubeGroup.rotateOnWorldAxis(axis, rotation - prev.rotation);
        prev.rotation = rotation; // Store the current rotation for next update
      })
      .onComplete(() => {
        cubeGroup.isRotating = false; // End the rotation
        // Correct for floating-point rounding errors by snapping to the nearest multiple of 90 degrees
        cubeGroup.rotation.set(
          Math.round(cubeGroup.rotation.x / (Math.PI / 2)) * (Math.PI / 2),
          Math.round(cubeGroup.rotation.y / (Math.PI / 2)) * (Math.PI / 2),
          Math.round(cubeGroup.rotation.z / (Math.PI / 2)) * (Math.PI / 2)
        );
      });

    tween.start(); // Start the tween animation
  }

  // Function to check if two cubes are aligned along the specified axis
  cubeInSameAxis(c1, c2, axis) {
    return (
      Math.abs(c1.cubeGroup.position[axis] - c2.cubeGroup.position[axis]) < this.epsilon
    );
  }

  // Event handler for keydown events to handle cube rotations based on key presses
  onKeyDown(event) {
    // Key mappings for cube rotations (e.g., 'L' for left rotation, 'R' for right rotation, etc.)
    const keyMap = {
      'L': { axis: new THREE.Vector3(-1, 0, 0), check: 'x', slice: -1 },   // Left up
      'l': { axis: new THREE.Vector3(1, 0, 0), check: 'x', slice: -1 },    // Left down
      'R': { axis: new THREE.Vector3(1, 0, 0), check: 'x', slice: 1 },     // Right up
      'r': { axis: new THREE.Vector3(-1, 0, 0), check: 'x', slice: 1 },    // Right down
      'U': { axis: new THREE.Vector3(0, 1, 0), check: 'y', slice: 1 },     // Up clockwise
      'u': { axis: new THREE.Vector3(0, -1, 0), check: 'y', slice: 1 },    // Up anticlockwise
      'D': { axis: new THREE.Vector3(0, -1, 0), check: 'y', slice: -1 },   // Down left
      'd': { axis: new THREE.Vector3(0, 1, 0), check: 'y', slice: -1 },    // Down right
      'F': { axis: new THREE.Vector3(0, 0, 1), check: 'z', slice: 1 },     // Front clockwise
      'f': { axis: new THREE.Vector3(0, 0, -1), check: 'z', slice: 1 },    // Front anticlockwise
      'B': { axis: new THREE.Vector3(0, 0, -1), check: 'z', slice: -1 },   // Back clockwise
      'b': { axis: new THREE.Vector3(0, 0, 1), check: 'z', slice: -1 }     // Back anticlockwise
    };
  
    // Check if the pressed key corresponds to a rotation action
    const action = keyMap[event.key];
    if (action) {
      // For each cube in the Rubik's Cube, rotate it if it belongs to the specified slice
      this.cubes.forEach((cube) => {
        // Only rotate cubes in the specified slice
        if (Math.abs(cube.cubeGroup.position[action.check] - action.slice) < this.epsilon) {
          this.rotateAroundWorldAxis(cube.cubeGroup, action.axis); // Rotate cube group around the axis
        }
      });
    }
  }
}
