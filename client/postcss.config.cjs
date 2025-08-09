// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
  // Ensure PostCSS knows about the environment
  env: {
    production: process.env.NODE_ENV === 'production',
  },
}