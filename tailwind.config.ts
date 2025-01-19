import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E1E2C",
        secondary: "#2A2A40",
        elements: "#323245",
        elementHover: "#2F2F3D",
        mainBlue: "#2563eb",
        mainActiveText: "#7ba1fb",
        secondaryText: "#8F8F9E",
        placeholderText: "#9f9f9f",
      },
      borderRadius: {
        main: "0.75rem"
      },
      textOverflow: {
        unset: "unset"
      },
      screens: {
        xsm: '400px'
      },
      maxHeight: {
        inherit: 'inherit'
      }
    },
  },
  plugins: [],
};
export default config;
