module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#172A3A",
        secondary: "#004346",
        tertiary: "#09BC8A",
        accent: "#508991",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
