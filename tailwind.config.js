/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    colors: {
      'background': '#1C1C23',
      'dark': '#000000',
      'white': '#ffffff',
      'foreground': '#666680',
      'orange': '#FF7966',
      'red': '#FF3B30',
      'green': '#00FAD9',
      'gray-light': '#A2A2B5',
      'violate': '#AD7BFF',
    },
  },
  plugins: [],
}
