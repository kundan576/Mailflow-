/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f0f0f',
          card: '#1a1a1a',
          hover: '#222222',
          sidebar: '#141414',
        },
        accent: {
          DEFAULT: '#4ade80',
          dim: 'rgba(74,222,128,0.15)',
          border: 'rgba(74,222,128,0.3)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          soft: 'rgba(255,255,255,0.05)',
        },
        text: {
          primary: '#e8e8e8',
          muted: 'rgba(255,255,255,0.5)',
          faint: 'rgba(255,255,255,0.25)',
        },
        priority: {
          high: '#f87171',
          med: '#fb923c',
          low: '#4ade80',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
