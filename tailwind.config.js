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
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
        },
        'secondary': '#14B8A6', // A cool, friendly teal
        'background': '#F9FAFB', // A very light, neutral grey
        'text-primary': '#1F2937', // A dark slate grey for primary text
        'text-secondary': '#6B7280', // A lighter grey for secondary text
        'accent': '#F59E0B',    // A warm, eye-catching amber
        'danger': '#EF4444',     // A clear red for errors
        'success': '#10B981',    // A clear green for success states
      },
    },
  },
  plugins: [],
}
