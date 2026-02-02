import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: { port: 5173, open: false },
  preview: { port: 5173 },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'game.html'
      }
    }
  }
});
