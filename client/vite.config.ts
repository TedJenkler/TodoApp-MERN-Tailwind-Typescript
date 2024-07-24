import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-dnd': 'react-dnd',
      'react-dnd-html5-backend': 'react-dnd-html5-backend',
    },
  },
});