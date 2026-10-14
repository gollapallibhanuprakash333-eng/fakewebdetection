/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0f1d',
          surface: '#111827',
          card: '#161f33',
          border: '#1f293d',
          accent: '#06b6d4',
          glow: '#00f0ff',
          blue: '#3b82f6',
        },
        risk: {
          low: '#10b981',
          suspicious: '#f59e0b',
          high: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
