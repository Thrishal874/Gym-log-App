/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          dark: '#5A52D5',
          light: '#8B85FF',
        },
        secondary: {
          DEFAULT: '#FF6B6B',
          dark: '#E55555',
        },
        accent: '#4ECDC4',
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',
        background: {
          DEFAULT: '#0F0F1A',
          light: '#1A1A2E',
          card: '#16213E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8D1',
          muted: '#6B6B8D',
        },
        border: {
          DEFAULT: '#2A2A4A',
          light: '#3A3A5A',
        },
      },
    },
  },
  plugins: [],
};
