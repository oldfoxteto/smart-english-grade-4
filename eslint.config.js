import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'src/ai-engine/**',
    'src/app/**',
    'src/ux/**',
    'src/learning-engine/**',
    'src/test/**',
    'src/utils/codeQuality.ts',
    'src/utils/testing.ts',
    'src/components/common/PerformanceOptimized.tsx',
    'src/components/notifications/SocialNotifications.tsx',
    'src/components/testing/MobileTestingGuide.tsx',
    'src/components/ui/AnimationSystem.tsx',
    'src/pages/archive/**',
    'src/pages/LessonsPage.tsx',
    'src/pages/PracticePageSimple.tsx',
    'src/mobile/**',
    'src/services/**',
    'tailwind.config.js',
    'vite.config.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'off',
      'no-empty': 'off',
      'no-cond-assign': 'off',
      'prefer-const': 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
