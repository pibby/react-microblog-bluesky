// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 1. Import the plugin
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    // 2. Add the plugin to the plugins array
    nodePolyfills({
      // Optional: specific options can go here if needed,
      // but defaults usually work well.
      // Example: To exclude specific polyfills:
      // exclude: ['fs'],
      // Example: To only include buffer:
      // include: ['buffer'],
      // globals: { // Ensure Buffer is added to globals
      //   Buffer: true,
      // }
    })
  ],
  // Optional: Add optimizeDeps entry if you face issues after install
  // optimizeDeps: {
  //   esbuildOptions: {
  //     define: {
  //       global: 'globalThis' // Or 'window'
  //     }
  //   }
  // }
})