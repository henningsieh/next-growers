import { type Config } from "tailwindcss";

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#ea580c',
          secondary: '#65a30d',
          accent: '#db2777',
          neutral: '#292524',
          'base-100': '#1c1917',
          info: '#155e75',
          success: '#166534',
          warning: '#b45309',
          error: '#dc2626',
        },
      },
      'luxury',
    ],
  },
  plugins: [require('daisyui')],
} satisfies Config;
