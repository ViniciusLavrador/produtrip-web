module.exports = {
  purge: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
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
