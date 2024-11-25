import * as THREE from 'three';
import { vertexShader, fragmentShader } from './Shaders';

export default class Cube {
  constructor(xOffset, yOffset, zOffset) {
    this.cubeGroup = new THREE.Group(); // Create a group to hold the cube and its edges
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Define geometry for a basic cube (1x1x1 unit)
    
    // Create a ShaderMaterial with the custom shaders
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader(), // Use the custom vertex shader
      fragmentShader: fragmentShader(), // Use the custom fragment shader
    });

    // Create the mesh for the cube using the geometry and material
    this.cubeMesh = new THREE.Mesh(geometry, material);

    // Create the edges of the cube (wireframe)
    const lineEdges = new THREE.EdgesGeometry(this.cubeMesh.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: '#000' }); // Black edges
    this.lineMesh = new THREE.LineSegments(lineEdges, lineMaterial); // LineSegments to represent the edges

    // Add the cube and line edges to the cubeGroup
    this.cubeGroup.add(this.cubeMesh);
    this.cubeGroup.add(this.lineMesh);

    // Set the position of the cubeGroup based on offsets
    this.cubeGroup.position.x = xOffset;
    this.cubeGroup.position.y = yOffset;
    this.cubeGroup.position.z = zOffset;
  }
}
