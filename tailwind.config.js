/** @type {import('tailwindcss').Config} */
const {heroui} = require("@heroui/theme");
module.exports = {
  content: [
    // single component styles
    "./node_modules/@heroui/theme/dist/components/button.js",
    // or you can use a glob pattern (multiple component styles)
    './node_modules/@heroui/theme/dist/components/(button|snippet|code|input).js',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
  ],
  theme: { extend: {} },
  plugins: [heroui()],
};
