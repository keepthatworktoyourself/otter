module.exports = {
  purge: ['src/**/*/.js', 'src/**/*/.jsx'],
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderColor: ['active'],
      display: ['group-hover'],
      textColor: ['active'],
    },
  },
  plugins: [ ],
}

