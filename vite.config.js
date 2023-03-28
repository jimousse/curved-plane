import glsl from 'vite-plugin-glsl';

export default {
  plugins: [glsl()],
  root: 'src/',
  base: './',
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
};
