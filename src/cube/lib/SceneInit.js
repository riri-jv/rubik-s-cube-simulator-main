import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class SceneInit {
  // Constructor initializes essential variables.
  constructor(canvasID, camera, scene, stats, controls, renderer, fov = 36) {
    this.fov = fov; // Field of view for the camera.
    this.scene = scene; // The 3D scene to render.
    this.stats = stats; // Performance statistics (if used).
    this.camera = camera; // The camera used for viewing the scene.
    this.controls = controls; // Controls to interact with the scene (like OrbitControls).
    this.renderer = renderer; // WebGLRenderer to render the scene.
    this.canvasID = canvasID; // The ID of the HTML canvas to render to.
  }

  // Initializes the scene, camera, renderer, and controls.
  initScene() {
    // Create a PerspectiveCamera with field of view (fov), aspect ratio (window width/height), and near/far clipping planes.
    this.camera = new THREE.PerspectiveCamera(this.fov, 881 / 753, 1, 1000);
    this.camera.position.z = 196; // Set the camera's position in the z-axis.

    this.scene = new THREE.Scene(); // Create the main scene object.
    
    // Get the canvas element using the passed canvasID and initialize the WebGLRenderer.
    const canvas = document.getElementById(this.canvasID);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); // Enable anti-aliasing for smoother rendering.
    this.renderer.setSize(881, 753); // Set the renderer size (aspect ratio based on canvas dimensions).

    // Initialize OrbitControls to allow for user interaction with the scene (e.g., rotating, zooming).
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  // Animation loop to continuously update and render the scene.
  animate() {
    // Use requestAnimationFrame to create an animation loop.
    window.requestAnimationFrame(this.animate.bind(this));
    this.render(); // Render the scene.
  }

  // Renders the scene from the perspective of the camera.
  render() {
    this.renderer.render(this.scene, this.camera); // Perform the rendering.
  }
}
