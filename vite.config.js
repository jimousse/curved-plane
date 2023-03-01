import glsl from 'vite-plugin-glsl';

export default {
  plugins: [glsl()],
  publicDir: '../public/',
  root: 'src/',
  base: './',
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    sourcemap: true,
  },
};
