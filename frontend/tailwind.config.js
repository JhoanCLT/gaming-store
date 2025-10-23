/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          primary: '#6366f1',
          secondary: '#1e293b',
          accent: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}
