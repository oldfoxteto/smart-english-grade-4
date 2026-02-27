import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const analyze = process.env.ANALYZE === 'true' || mode === 'analysis'

  return {
    plugins: [react(), analyze && visualizer({ filename: 'dist/bundle-analysis.html', open: false })].filter(Boolean),
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
