import React from 'react'
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
                     exitBeforeEnter={true}
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
