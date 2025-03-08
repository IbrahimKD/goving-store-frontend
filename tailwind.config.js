/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    colors: {
      primary: "#0084fe",
      // primary: "#fe7900",
      // primary: "#e64444",
      // primary: "#4744e6",
      secondary: "#0d141d",
      accent: "#a6a9ac",
      title: "#dee2e6",
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      gray: colors.gray,
      zinc: colors.zinc,
      neutral: colors.neutral,
      stone: colors.stone,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky, // In Tailwind CSS v2.2+, you can use 'lightBlue' instead of 'sky'
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
      transparent: colors.transparent,
    },
    extend: {},
    backdropBlur: {
      sm: "4px",
      md: "6px",
      xl: "10px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
