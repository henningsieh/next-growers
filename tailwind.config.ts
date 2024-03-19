import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      // fix editor background color
      "input-dark-background": "#25262b",
      "input-light-background": "#ffffff",
    },
  },
} satisfies Config;
