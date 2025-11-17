/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./*.ts",
    "./pages/**/*.tsx",
    "./components/**/*.tsx",
    "./layouts/**/*.tsx",
    "./hooks/**/*.tsx",
    "./pages/**/*.ts",
    "./components/**/*.ts",
    "./layouts/**/*.ts",
    "./hooks/**/*.ts",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-accent': '#FF6B35',
      },
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
