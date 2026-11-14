/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'hud-cyan': '#96e0f7',
        'hud-cyan-dark': '#09a4c7',
        'hud-dark': '#0a0d14',
        'hud-card': '#0e1c3b',
        'hud-gold': '#f8b800',
        'pin-green': '#00ff50',
        'pin-red': '#ff4040',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace', 'Courier New', 'sans-serif'],
        display: ['Impact', 'Arial Black', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
