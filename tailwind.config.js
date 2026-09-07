/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e58ff',
          dark: '#1240c4',
          soft: '#eaf0ff',
        },
        ink: {
          DEFAULT: '#0b1633',
          soft: '#45507a',
        },
        surface: '#f5f7fc',
        saffron: '#ff9933',
        igreen: '#138808',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
