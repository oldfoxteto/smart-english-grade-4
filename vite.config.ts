import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const analyze = process.env.ANALYZE === 'true' || mode === 'analysis'

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon-192.png', 'icon-512.png'],
        manifest: {
          name: 'لسان AI - منصة التعلم الذكية',
          short_name: 'لسان AI',
          description: 'منصة ذكية لتعلم الإنجليزية واليونانية بالذكاء الاصطناعي',
          theme_color: '#4CAF50',
          background_color: '#F8FAFB',
          display: 'standalone',
          orientation: 'portrait',
          lang: 'ar',
          dir: 'rtl',
          start_url: '/',
          scope: '/',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
          categories: ['education'],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
            }
          ]
        },
      }),
      analyze && visualizer({ filename: 'dist/bundle-analysis.html', open: false }),
    ].filter(Boolean),
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // pages -> separate page chunks
            const pagesRoot = path.resolve(__dirname, 'src', 'pages')
            if (id.startsWith(pagesRoot)) {
              const parts = id.split(path.sep)
              const nameIndex = parts.indexOf('pages') + 1
              const name = parts[nameIndex] || 'page'
              return `page.${name}`
            }

            // node_modules: group by package name (scoped packages included)
            const nm = `${path.sep}node_modules${path.sep}`
            const idx = id.indexOf(nm)
            if (idx >= 0) {
              let sub = id.slice(idx + nm.length)
              const parts = sub.split(path.sep)
              let pkg = parts[0]
              if (pkg.startsWith('@') && parts.length > 1) {
                pkg = `${pkg}/${parts[1]}`
              }

              // special groupings
              if (pkg === 'react' || pkg === 'react-dom') return 'vendor.react'
              if (pkg === 'react-router-dom') return 'vendor.router'
              if (pkg.startsWith('@mui') || pkg === '@emotion/react' || pkg === '@emotion/styled') return 'vendor.mui'

              // fallback: group by package name
              return `vendor.${pkg.replace('/', '.')}`
            }
          }
        }
      }
    }
  }
})
