/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* -------- WILDMIND COLORS -------- */
      colors: {
        wm: {
          blue: {
            50: '#EEF7FC',
            100: '#DCF0FA',
            200: '#B9E1F5',
            300: '#96D2F0',
            400: '#82C3F0',
            500: 'rgb(var(--wm-blue-500) / <alpha-value>)',
            600: '#4A9CD6',
            700: '#3A7CB0',
          },
          gold: {
            50: '#FEF9F0',
            100: '#FDF3E1',
            200: '#FBE7C3',
            300: '#F8D9A5',
            400: 'rgb(var(--wm-gold-400) / <alpha-value>)',
            500: '#D4A054',
            600: '#B8843A',
          },
          coral: {
            400: '#ECA19A',
            500: 'rgb(var(--wm-coral-500) / <alpha-value>)',
            600: '#D67268',
          },
          navy: {
            800: '#2D3A54',
            900: 'rgb(var(--wm-navy-900) / <alpha-value>)',
          },
          canvas: 'rgb(var(--wm-canvas) / <alpha-value>)',
          surface: 'rgb(var(--wm-surface) / <alpha-value>)',
          border: 'rgb(var(--wm-border) / <alpha-value>)',
          muted: 'rgb(var(--wm-muted) / <alpha-value>)',
          glass: 'rgb(var(--wm-glass) / <alpha-value>)',
        },
      },

      /* -------- TYPOGRAPHY -------- */
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        ui: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading': ['1.75rem', { lineHeight: '1.3' }],
        'subheading': ['1.25rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'label': ['0.75rem', { lineHeight: '1.4' }],
      },

      /* -------- SPACING -------- */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      /* -------- BORDER RADIUS -------- */
      borderRadius: {
        'wm-btn': '12px',
        'wm-card': '18px',
        'wm-lg': '24px',
        'wm-pill': '9999px',
      },

      /* -------- BOX SHADOW -------- */
      boxShadow: {
        'wm-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'wm-md': '0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'wm-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.10)',
        'wm-xl': '0 20px 40px -12px rgba(0, 0, 0, 0.12)',
        'elev1': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 20px 40px -4px rgba(0, 0, 0, 0.06)',
        'elev2': '0 8px 16px -4px rgba(0, 0, 0, 0.05), 0 32px 64px -8px rgba(0, 0, 0, 0.10)',
        'glow-blue': '0 0 0 1px rgba(108, 182, 232, 0.15), 0 8px 32px -4px rgba(108, 182, 232, 0.25)',
        'glow-gold': '0 0 0 1px rgba(242, 192, 120, 0.15), 0 8px 32px -4px rgba(242, 192, 120, 0.25)',
      },

      /* -------- BACKDROP BLUR -------- */
      backdropBlur: {
        'wm': '14px',
      },

      /* -------- MAX WIDTH -------- */
      maxWidth: {
        'container': '1200px',
        'hero': '680px',
        'content': '960px',
      },

      /* -------- ANIMATION -------- */
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'fade-in': 'fade-in-up 0.6s ease-out forwards',
        'pulse-soft': 'pulse-ring 4s ease-in-out infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
      },

      /* -------- TRANSITION -------- */
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
