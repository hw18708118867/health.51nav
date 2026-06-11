import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#183237",
        mist: "#f4fbf8",
        sand: "#dfeee7",
        coral: "#f07f5a",
        sage: "#5fa48f",
        pine: "#1f5d57",
        gold: "#f2c46d",
        mint: "#dff5ee",
        sky: "#d8eff7",
        foam: "#f8fdfb",
        clay: "#9b7761"
      },
      fontFamily: {
        sans: ["Manrope Variable", "Avenir Next", "Segoe UI", "sans-serif"],
        serif: ["Newsreader", "Georgia", "serif"]
      },
      boxShadow: {
        panel: "0 24px 70px rgba(31, 93, 87, 0.10)",
        float: "0 18px 45px rgba(24, 50, 55, 0.08)"
      },
      backgroundImage: {
        "mesh-glow":
          "radial-gradient(circle at top left, rgba(95, 164, 143, 0.28), transparent 36%), radial-gradient(circle at top right, rgba(216, 239, 247, 0.36), transparent 34%), radial-gradient(circle at bottom left, rgba(240, 127, 90, 0.16), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.88), rgba(248,253,251,0.98))",
        "pulse-soft":
          "linear-gradient(135deg, rgba(31,93,87,0.96), rgba(95,164,143,0.9) 48%, rgba(216,239,247,0.92))"
      }
    }
  },
  plugins: [typography]
};
