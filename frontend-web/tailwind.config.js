/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        medical: {
          blue: '#1976D2',
          emerald: '#43A047', 
          teal: '#26A69A',
          surface: '#F5F7FA',
          error: '#D32F2F',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(25, 118, 210, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(25, 118, 210, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
