import * as THREE from 'three';
import { createCurve } from './curve';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const createPlaneMaterial = ({
  color = null,
  speed = 0,
  transparentPortion,
} = {}) => {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    depthWrite: false,
    transparent: true,
    lights: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: {
        value: 0,
      },
      ...THREE.UniformsLib['lights'],
      color: {
        value: new THREE.Color(...color),
      },
      uSpeed: {
        value: speed,
      },
      uTransparentPortion: {
        value: transparentPortion,
      },
    },
  });
};

const createCurvedPlane = (curveOptions, materialOptions) => {
  const num = 1000;
  const curve = createCurve(curveOptions);
  const material = createPlaneMaterial(materialOptions);
  const frenetFrames = curve.computeFrenetFrames(num, true);
  const spacedPoints = curve.getSpacedPoints(num);
  const geometry = new THREE.PlaneGeometry(1, 1, num, 1);

  const width = materialOptions.width;

  const dimensions = [-width / 2, width / 2];
  const finalPoints = [];

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

  geometry.setFromPoints(finalPoints);

  return new THREE.Mesh(geometry, material);
};

export const createCurvedPlanes = () => {
  const numOfPlanes = 75;
  const planeGroup = new THREE.Group();

  for (let i = 0; i < numOfPlanes; i++) {
    const curveOptions = {
      radius: Math.random() * 30,
      phi: (Math.PI / 2) * Math.random(),
      isVertical: Math.random() - 0.5 > 0,
      amplitude: 0.5 + Math.random(),
    };
    const materialOptions = {
      color: [Math.random(), Math.random(), Math.random()],
      speed: Math.random() * 0.5,
      transparentPortion: Math.random() * 0.9,
      width: 0.5 * Math.random() + 0.1,
    };
    const plane = createCurvedPlane(curveOptions, materialOptions);
    planeGroup.add(plane);
  }

  return planeGroup;
};
