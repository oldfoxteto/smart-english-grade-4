// Tailwind Configuration aligned with Design Tokens
import type { Config } from 'tailwindcss';
import { tokens } from '../src/design-system/tokens';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      // Spacing - aligned with design tokens
      spacing: {
        '0': '0px',
        '1': '4px',   // xs
        '2': '8px',   // sm
        '3': '12px',  // md
        '4': '16px',  // lg
        '6': '24px',  // xl
        '8': '32px',  // xxl
        '12': '48px', // xxxl
      },

      // Border Radius - aligned with design tokens
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'full': '9999px',
      },

      // Typography - aligned with design tokens
      fontSize: {
        'title': ['20px', { lineHeight: '1.2', fontWeight: '600' }],
        'subtitle': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
      },

      // Colors - aligned with design tokens
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        secondary: {
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#9C27B0',
          600: '#8E24AA',
          700: '#7B1FA2',
          800: '#6A1B9A',
          900: '#4A148C',
        },
        success: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        danger: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        background: {
          default: '#FFFFFF',
          paper: '#FFFFFF',
          surface: '#F8F9FA',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
          disabled: '#BDBDBD',
          hint: '#9E9E9E',
        },
      },

      // Box Shadow - aligned with design tokens
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      // Transitions - aligned with design tokens
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },

      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },

      // Icon sizes - aligned with design tokens
      iconSize: {
        'xs': '16px',
        'sm': '20px',
        'md': '24px',
        'lg': '32px',
        'xl': '40px',
      },

      // Animation keyframes
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },

      // Animation utilities
      animation: {
        'fade-in': 'fade-in 0.2s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },

      // Z-index scale
      zIndex: {
        'dropdown': 1000,
        'sticky': 1020,
        'fixed': 1030,
        'modal-backdrop': 1040,
        'modal': 1050,
        'popover': 1060,
        'tooltip': 1070,
        'toast': 1080,
      },

      // Breakpoints - aligned with design tokens
      screens: {
        'xs': '0px',
        'sm': '600px',
        'md': '900px',
        'lg': '1200px',
        'xl': '1536px',
      },
    },
  },
  plugins: [
    // Custom utilities for design system
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Text utilities
        '.text-title': {
          fontSize: theme('fontSize.title'),
          fontWeight: theme('fontSize.title[1].fontWeight'),
          lineHeight: theme('fontSize.title[1].lineHeight'),
        },
        '.text-subtitle': {
          fontSize: theme('fontSize.subtitle'),
          fontWeight: theme('fontSize.subtitle[1].fontWeight'),
          lineHeight: theme('fontSize.subtitle[1].lineHeight'),
        },
        '.text-body': {
          fontSize: theme('fontSize.body'),
          fontWeight: theme('fontSize.body[1].fontWeight'),
          lineHeight: theme('fontSize.body[1].lineHeight'),
        },
        '.text-caption': {
          fontSize: theme('fontSize.caption'),
          fontWeight: theme('fontSize.caption[1].fontWeight'),
          lineHeight: theme('fontSize.caption[1].lineHeight'),
        },

        // Spacing utilities
        '.space-y-card': {
          '& > * + *': {
            marginTop: theme('spacing.4'),
          },
        },
        '.space-x-card': {
          '& > * + *': {
            marginLeft: theme('spacing.4'),
          },
        },

        // Card utilities
        '.card-hover': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.md'),
          },
        },
        '.card-interactive': {
          cursor: 'pointer',
          userSelect: 'none',
        },

        // Button utilities
        '.btn-primary': {
          backgroundColor: theme('colors.primary.500'),
          color: 'white',
          borderRadius: theme('borderRadius.md'),
          padding: `${theme('spacing.1')} ${theme('spacing.4')}`,
          fontWeight: '500',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.primary.600'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.md'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },

        // Progress utilities
        '.progress-sm': {
          height: '4px',
          borderRadius: theme('borderRadius.sm'),
        },
        '.progress-md': {
          height: '8px',
          borderRadius: theme('borderRadius.sm'),
        },
        '.progress-lg': {
          height: '12px',
          borderRadius: theme('borderRadius.sm'),
        },

        // Icon utilities
        '.icon-xs': {
          width: theme('iconSize.xs'),
          height: theme('iconSize.xs'),
        },
        '.icon-sm': {
          width: theme('iconSize.sm'),
          height: theme('iconSize.sm'),
        },
        '.icon-md': {
          width: theme('iconSize.md'),
          height: theme('iconSize.md'),
        },
        '.icon-lg': {
          width: theme('iconSize.lg'),
          height: theme('iconSize.lg'),
        },
        '.icon-xl': {
          width: theme('iconSize.xl'),
          height: theme('iconSize.xl'),
        },

        // Accessibility utilities
        '.focus-ring': {
          '&:focus': {
            outline: `2px solid ${theme('colors.primary.500')}`,
            outlineOffset: '2px',
          },
        },
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
      };

      addUtilities(newUtilities);
    },
  ],
  darkMode: 'class', // Enable dark mode support
};

export default config;
