varying vec2 vUv;
uniform float uTime;

void main() {
  float start = mod(uTime, 1.0);
  float start_bis = -(1.0 - start);
  float bandSize = 0.1;
  float y = step(start, vUv.x)*step(-(start + bandSize), -vUv.x);
  float y_bis = step(start_bis, vUv.x)*step(-(start_bis + bandSize), -vUv.x);
  y += y_bis;

  gl_FragColor = vec4(0.0, 0.0, 1.0 - y, 1.0 - y);
}