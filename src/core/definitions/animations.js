export default {
  item_add_and_remove: {
    initial: {
      opacity: 0,
      height:  0,
      scale:   0.8,
    },
    animate: {
      opacity:    1,
      height:     'auto',
      scale:      1,
      transition: {
        type:      'spring',
        damping:   30,
        stiffness: 350,
      },
    },
    exit: {
      opacity:    0,
      height:     0,
      scale:      0.8,
      x:          1000,
      transition: {
        x: {
          type:      'spring',
          damping:   50,
          stiffness: 1000,
        },
      },
    },
  },
}
