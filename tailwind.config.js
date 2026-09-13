/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep black/charcoal backgrounds
        ink: {
          950: '#0a0a0b',
          900: '#0e0e10',
          850: '#131316',
          800: '#1a1a1e',
          700: '#222227',
          600: '#2c2c33',
        },
        // Dark warm brown accents
        bronze: {
          50: '#faf6f1',
          100: '#f5ebe0',
          200: '#e8d5bf',
          300: '#d4b48a',
          400: '#c49b5e',
          500: '#b8853f',
          600: '#a67030',
          700: '#8a5a28',
          800: '#6b4420',
          900: '#4d3017',
        },
        // Soft off-white
        cream: '#f5f3f0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'fade-in-delay': 'fadeInUp 0.8s ease-out 0.2s forwards',
        'fade-in-delay-2': 'fadeInUp 0.8s ease-out 0.4s forwards',
        'fade-in-delay-3': 'fadeInUp 0.8s ease-out 0.6s forwards',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slow-2': 'float 10s ease-in-out infinite',
        'data-flow': 'dataFlow 3s linear infinite',
        'data-flow-reverse': 'dataFlowReverse 3s linear infinite',
        'scan-line': 'scanLine 4s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'counter': 'counter 1s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        dataFlow: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-40' },
        },
        dataFlowReverse: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '40' },
        },
        scanLine: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.3' },
          '50%': { transform: 'translateY(200px)', opacity: '0.6' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        counter: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
