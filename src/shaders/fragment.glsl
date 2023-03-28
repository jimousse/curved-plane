varying vec2 vUv;
uniform float uTime;
uniform vec3 color;
uniform float uSpeed;
uniform float uTransparentPortion;

void main() {
  float start = mod(uTime * uSpeed, 1.0);
  float start_bis = -(1.0 - start);
  float bandSize = uTransparentPortion;
  float y = step(start, vUv.x)*step(-(start + bandSize), -vUv.x);
  float y_bis = step(start_bis, vUv.x)*step(-(start_bis + bandSize), -vUv.x);
  y += y_bis;

  gl_FragColor = vec4(vec3(color), 1.0 - y);
}