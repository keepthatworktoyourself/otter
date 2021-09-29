module.exports = {
  purge: {
    content: ['src/**/*/.js', 'src/**/*/.jsx'],
  },
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

