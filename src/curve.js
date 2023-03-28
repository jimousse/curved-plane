import * as THREE from 'three';

export const createCurve = ({
  radius = 1,
  phi = Math.PI / 2,
  isVertical = false,
  amplitude = 1,
} = {}) => {
  let numberOfPoints = 10;
  const curvePoints = [];

  for (let i = 0; i < numberOfPoints; i++) {
    let theta = (i / numberOfPoints) * 2 * Math.PI;
    let currentPoint;
    const randomness = (Math.random() - 0.5) * amplitude;
    if (isVertical) {
      currentPoint = new THREE.Vector3().setFromSphericalCoords(
        radius,
        theta,
        phi + randomness
      );
    } else {
      currentPoint = new THREE.Vector3().setFromSphericalCoords(
        radius,
        phi + randomness,
        theta
      );
    }
    curvePoints.push(currentPoint);
  }
  //Create a closed wavey loop
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  curve.tension = 0.7;
  curve.closed = true;

  // const points = curve.getPoints(50);
  // const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  // const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // // Create the final object to add to the scene
  // const curveObject = new THREE.Line(curveGeometry, curveMaterial);
  // scene.add(curveObject);
  return curve;
};
