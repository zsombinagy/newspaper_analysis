/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        main_blue: '#036487',
        main_yellow: '#ffc700',
        main_error: "#FF0000"

      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}

