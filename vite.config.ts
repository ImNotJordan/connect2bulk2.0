import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    build: {
      // Enable minification with esbuild (faster than terser)
      minify: 'esbuild',
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'aws-vendor': ['aws-amplify', '@aws-amplify/ui-react'],
            'ui-vendor': ['styled-components', '@iconify-icon/react'],
            'chart-vendor': ['chart.js', 'react-chartjs-2'],
          },
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Enable source maps for debugging (can be disabled in production)
      sourcemap: false,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'aws-amplify',
        '@aws-amplify/ui-react',
        'styled-components',
      ],
    },
    // Performance optimizations
    server: {
      hmr: {
        overlay: false, // Disable error overlay for better performance
      },
    },
    define: {
      'process.env': env
    }
  };
});