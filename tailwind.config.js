/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#3B82F6', // Vibrant Blue
          dark: '#2563EB',
          light: '#60A5FA',
        },
        'secondary': '#0EA5E9', // Sky Blue
        'background': '#F0F9FF', // Very light blue/white
        'surface': '#FFFFFF',
        'text': {
            DEFAULT: '#0F172A', // Slate 900
            secondary: '#475569', // Slate 600
            light: '#94A3B8',
        },
        'border': '#E2E8F0',
        'cta': '#F97316', // Orange for contrast
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Work Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
