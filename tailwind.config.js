/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    colors: {
      'background': '#0E0E12',
      'background-variant': '#26262F',
      'dark': '#000000',
      'white': '#ffffff',
      'foreground': '#666680',
      'orange': '#FF7966',
      'red': '#FF3B30',
      'green': '#00FAD9',
      'gray-light': '#A2A2B5',
      'grey-40': '#83839C',
      'grey-70': '#353542',
      'violate': '#AD7BFF',
    },
  },
  plugins: [],
}
