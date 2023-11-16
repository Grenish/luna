/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        'pop' : ['Poppins', 'sans-serif']
      },
      colors:{
        bitter: "#EB5E55",
        primeBlack: "#3A3335",
        raspberry: "#D81E5B",
        pap: "#FDF0D5",
        ash: "#C6D8D3",
        van: "#E4D6A7",
      }
    },
  },
  plugins: [],
};
