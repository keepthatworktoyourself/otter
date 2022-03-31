import React from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {classNames} from '../../helpers/style'

export default function CollapseTransition({
  collapsed = false,
  style,
  children,
  className,
  ...props
}) {
  return (
    <div style={style} className={classNames('w-full', className)} {...props}>
      <AnimatePresence initial={false}>
        {!collapsed && (
        <motion.section initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open:      {opacity: 1, height: 'auto', overflow: 'visible'},
                          collapsed: {opacity: 0, height: 0, overflow: 'hidden'},
                        }}
                        transition={{duration: 0.175}}
        >
          {children}
        </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
