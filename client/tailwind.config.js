/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Dark Blue for Sidebar
        secondary: "#3b82f6", // Launchpad Blue
        accent: "#10b981", // Success Green
      },
    },
  },
  plugins: [],
}