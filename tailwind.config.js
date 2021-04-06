const colors = require('tailwindcss/colors');
module.exports = {
  purge: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
      },
      fontSize: {
        '2xs': '0.5rem',
      },
      zIndex: {
        '-10': '-10',
      },
      transitionProperty: {
        height: 'height',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
