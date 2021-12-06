import {AnimatePresence, motion} from 'framer-motion'

export default function PopoverAnimation({
  isOpen,
  onExitComplete,
  style,
  transformOrigin,
  Component,
  ...props
}) {
  return (
    <AnimatePresence initial={true}
    // Only render one component at a time.
    // The exiting component will finish its exit
    // animation before entering component is rendered
                     exitBeforeEnter={true}
    // Fires when all exiting nodes have completed animating out
                     onExitComplete={onExitComplete}
    >
      {isOpen && (
        <motion.div className="relative z-10"
                    style={{
                      ...style,
                      transformOrigin,
                    }}
                    initial={{
                      opacity: 0,
                      scale:   0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale:   1,
                    }}
                    exit={{
                      opacity: 0,
                      scale:   0.9,
                    }}
                    transition={{
                      scale: {
                        type:      'spring',
                        damping:   15,
                        stiffness: 600,
                      },
                      default: {duration: 0.1},
                    }}
                    {...props}
        >
          {Component}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
