const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,jsx}', './demo/**/*.{js,jsx}'],
  theme:   {
    fontSize: {
      xxxs: '8px',
      xxs:  '10px',
      xs:   '12px',
      sm:   '14px',
      base: '16px',
      md:   '16px',
      lg:   '18px',
      xl:   '20px',
      xxl:  '23px',
    },
    colors: {
      transparent: 'transparent',
      white:       'white',
      red:         colors.red,
      zinc:        colors.zinc,
      pink:        colors.pink, // just for demo
    },
  },
  plugins: [],
}

