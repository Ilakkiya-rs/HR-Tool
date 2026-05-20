import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  appType: 'spa',
  plugins: [react()],
  server: {
    // allowedHosts: ['7c5c-103-131-213-183.ngrok-free.app']
    // proxy: {
    //   // '/members': 'http://localhost:5000', // Proxy API requests to the Flask backend
    //   '/generate-assessment': 'http://localhost:5000'
    // },
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
})
