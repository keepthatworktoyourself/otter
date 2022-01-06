const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['src/**/*/.js', 'src/**/*/.jsx'],
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderColor:     ['active'],
      display:         ['group-hover'],
      padding:         ['group-hover'],
      textColor:       ['active'],
    },
  },
  theme: {
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
      gray:        colors.trueGray,
      pink:        colors.pink, // just for demo
    },
  },
  plugins: [],
}

