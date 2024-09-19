/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'display': ['Anybody', 'ui-sans-serif']
    },
    extend: {
      colors: {
        darkBg:{
          DEFAULT: "#131515"
        },
        darkGrey: {
          DEFAULT: "#2B2C28"
        },
        darkTeal: {
          DEFAULT: "#339989"
        },
        lightTeal: {
          DEFAULT: "#7DE2D1"
        },
        offWhite: {
          DEFAULT: "#FFFAFB"
        }
      }
    },
  },
  plugins: [],
}

