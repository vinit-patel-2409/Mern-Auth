/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true, // Add !important to all Tailwind utilities
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    preflight: true, // Keep preflight enabled
  },
  // Disable JIT mode explicitly
  mode: 'jit',
  // Ensure all variants are available
  variants: {
    extend: {
      backgroundColor: ['active', 'hover', 'focus'],
      textColor: ['active', 'hover', 'focus'],
      borderColor: ['active', 'hover', 'focus'],
    },
  },
  // Add important selectors
  important: '#root',
}
