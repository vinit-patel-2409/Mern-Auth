/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css"
  ],
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
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Ensure CSS is properly purged in production
  safelist: [
    {
      pattern: /./, // Include all classes in development
      variants: ['hover', 'focus', 'active'],
    },
  ],
  // Disable preflight to prevent conflicts with other CSS
  corePlugins: {
    preflight: true,
  }
}
