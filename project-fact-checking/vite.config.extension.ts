import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/extension/manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/extension/Popup.tsx',
        background: 'src/extension/background.ts',
        content: 'src/extension/content.ts',
      },
    },
  },
});