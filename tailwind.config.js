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
            50: '#EBF5FB',
            100: '#D6EBFA',
            200: '#ADD7F5',
            300: '#85C3F0',
            400: '#7DBDEC',
            500: 'rgb(var(--wm-blue-500) / <alpha-value>)',
            600: '#5A9ECE',
            700: '#4786B4',
          },
          gold: {
            50: '#FEF7ED',
            100: '#FDEFDB',
            200: '#FBDFB7',
            300: '#F8CF93',
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
          canvas: 'rgb(var(--wm-neutral-50) / <alpha-value>)',
          surface: 'rgb(var(--wm-neutral-0) / <alpha-value>)',
          border: 'rgb(var(--wm-neutral-200) / <alpha-value>)',
          muted: 'rgb(var(--wm-neutral-400) / <alpha-value>)',
        },
      },

      /* -------- TYPOGRAPHY -------- */
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        ui: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['60px', { lineHeight: '68px', letterSpacing: '-0.02em' }],
        'display-2': ['40px', { lineHeight: '48px', letterSpacing: '-0.01em' }],
        'heading-1': ['28px', { lineHeight: '36px' }],
        'body': ['16px', { lineHeight: '26px' }],
        'small': ['14px', { lineHeight: '22px' }],
        'label': ['12px', { lineHeight: '16px' }],
      },

      /* -------- SPACING -------- */
      spacing: {
        'wm-1': '4px',
        'wm-2': '8px',
        'wm-3': '12px',
        'wm-4': '16px',
        'wm-6': '24px',
        'wm-8': '32px',
        'wm-12': '48px',
        'wm-16': '64px',
        'wm-24': '96px',
      },

      /* -------- BORDER RADIUS -------- */
      borderRadius: {
        'wm-sm': '8px',
        'wm-md': '12px',
        'wm-lg': '18px',
        'wm-xl': '24px',
        'wm-full': '9999px',
      },

      /* -------- BOX SHADOW -------- */
      boxShadow: {
        'wm-elev1': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'wm-elev2': '0 30px 70px rgba(0, 0, 0, 0.12)',
        'wm-glow-blue': '0 0 0 1px rgba(108, 182, 232, 0.20), 0 20px 50px rgba(108, 182, 232, 0.22)',
        'wm-glow-gold': '0 0 0 1px rgba(242, 192, 120, 0.20), 0 20px 50px rgba(242, 192, 120, 0.22)',
        'wm-glow-coral': '0 0 0 1px rgba(232, 136, 124, 0.20), 0 20px 50px rgba(232, 136, 124, 0.22)',
      },

      /* -------- BACKDROP BLUR -------- */
      backdropBlur: {
        'wm': '14px',
      },

      /* -------- MAX WIDTH -------- */
      maxWidth: {
        'wm-container': '1280px',
        'wm-hero': '720px',
      },

      /* -------- ANIMATION -------- */
      animation: {
        'wm-float': 'wm-float 6s ease-in-out infinite',
        'wm-pulse': 'wm-pulse-glow 3s ease-in-out infinite',
        'wm-fade-in': 'wm-fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        'wm-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'wm-pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'wm-fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
