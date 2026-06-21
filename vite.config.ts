import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  server: {
    // Bind to IPv4 loopback so http://localhost works regardless of how the
    // browser resolves "localhost" (some resolve to IPv6 [::1] only).
    host: '127.0.0.1',
    port: 5173,
  },
})
