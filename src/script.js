import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

// Debug
const gui = new dat.GUI();
gui.hide();
if (window.location.hash === '#debug') {
  gui.show();
}

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(1, 30, 30);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let numberOfPoints = 10;
const curvePoints = [];
for (let i = 0; i < numberOfPoints; i++) {
  let theta = (i / numberOfPoints) * 2 * Math.PI;
  curvePoints.push(
    new THREE.Vector3().setFromSphericalCoords(
      1,
      Math.PI / 2 + (Math.random() - 0.5),
      theta
    )
  );
}

//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3(curvePoints);
curve.tension = 0.7;
curve.closed = true;

const points = curve.getPoints(50);
const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

// // Create the final object to add to the scene
const curveObject = new THREE.Line(curveGeometry, curveMaterial);

scene.add(curveObject);

let num = 1000;
let frenetFrames = curve.computeFrenetFrames(num, true);
let spacedPoints = curve.getSpacedPoints(num);
let tempPlane = new THREE.PlaneGeometry(1, 1, num, 1);

let dimensions = [-0.1, 0.1];
let point = new THREE.Vector3();
let binormalShift = new THREE.Vector3();
let finalPoints = [];

dimensions.forEach((d) => {
  for (let i = 0; i <= num; i++) {
    const currentSpacedPoint = new THREE.Vector3().copy(spacedPoints[i]);
    const binormalShift = new THREE.Vector3()
      .copy(frenetFrames.binormals[i])
      .multiplyScalar(d);
    finalPoints.push(currentSpacedPoint.add(binormalShift));
  }
});

finalPoints[0].copy(finalPoints[num]);
finalPoints[num + 1].copy(finalPoints[2 * num + 1]);

tempPlane.setFromPoints(finalPoints);

let tempMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  wireframe: false,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
});

let finalMesh = new THREE.Mesh(tempPlane, tempMaterial);
scene.add(finalMesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  tempMaterial.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
