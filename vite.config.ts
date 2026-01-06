import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Pixel Pro Technology',
        short_name: 'Pixel Pro',
        description: 'A shop for premium tech accessories and gadgets',
        theme_color: '#ffffff',
        background_color: '#ffffff', // 🔥 ADD THIS for splash screen
        start_url: '/', // 🔥 ADD THIS
        display: 'standalone', // 🔥 ADD THIS
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png' // 🔥 Changed from 'image/png' to 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png' // 🔥 Changed from 'image/png' to 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png', // 🔥 Changed to 'image/png' since it's .png
            purpose: 'any maskable'
          }
        ]
      },
      // 🔥 ADD THIS for offline support
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}']
      },
      // 🔥 ADD THIS to enable in development
      devOptions: {
        enabled: false // Set to true if you want to test PWA in dev mode
      }
    })
  ]
})