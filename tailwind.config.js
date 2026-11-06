/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0C0C0C",
        "primary-text": "#D7E2EA",
        "service-bg": "#FFFFFF",
        "service-text": "#0C0C0C",
      },
      fontFamily: {
        kanit: ['"Kanit"', 'sans-serif'],
        sans: ['"Kanit"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)',
        'contact-btn': 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
      }
    },
  },
  plugins: [],
}
