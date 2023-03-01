import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load('/s_parole3_blank.png');

texture.wrapS = 1000;
texture.wrapT = 1000;
texture.repeat.set(1, 1);
texture.offset.setX(0.5);

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

const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.x = 3;
pointLight.position.y = 3;
pointLight.position.z = 3;
// pointLight.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(pointLight);

const geometry = new THREE.SphereGeometry(1, 30, 30);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

let numberOfPoints = 20;
const curvePoints = [];
for (let i = 0; i < numberOfPoints; i++) {
  let theta = (i / numberOfPoints) * 2 * Math.PI;
  curvePoints.push(
    new THREE.Vector3().setFromSphericalCoords(
      0.5 + Math.random(),
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

// scene.add(curveObject);

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
    point = spacedPoints[i];
    binormalShift.add(frenetFrames.binormals[i]).multiplyScalar(d);
    finalPoints.push(new THREE.Vector3().copy(point).add(binormalShift));
  }
});

finalPoints[0].copy(finalPoints[num]);
finalPoints[num + 1].copy(finalPoints[2 * num + 1]);

tempPlane.setFromPoints(finalPoints);

let tempMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.65,
  metalness: 0.25,
  map: texture,
  side: THREE.DoubleSide,
  alphaTest: true,
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

  tempMaterial.map.offset.setX(elapsedTime * 0.2);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
