import React, {useRef} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import XCircleSolid from 'simple-react-heroicons/icons/XCircleSolid'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import useOnClickOutside from '../../hooks/useOnClickOutside'

const Backdrop = () => {
  const theme_ctx = useThemeContext()

  return (
    <motion.div initial={{opacity: 0}}
                className={classNames(
                  'absolute-fill',
                  theme_ctx.classes.skin.modal.bg,
                )}
                animate={{
                  opacity:    0.8,
                  transition: {
                    type:      'spring',
                    damping:   30,
                    stiffness: 350,
                  },
                }}
                exit={{opacity: 0}} />
  )
}

const scaleIn = {
  hidden: {
    opacity: 0,
    scale:   0.8,
  },
  visible: {
    opacity:    1,
    scale:      1,
    transition: {
      type:      'spring',
      damping:   25,
      stiffness: 300,
    },
  },
  exit: {
    opacity:    0,
    scale:      0.8,
    transition: {
      type:      'spring',
      damping:   25,
      stiffness: 350,
    },
  },
}


const ModalLayout = ({children, close}) => {
  const ref = useRef()
  useOnClickOutside({ref, handler: () => close && close()})

  const theme_ctx = useThemeContext()

  return (
    <div style={{zIndex: 99999}}
         className={classNames(
           'fixed top-0 right-0 bottom-0 left-0',
           'flex items-center justify-center',
         )}
    >
      <Backdrop />
      <motion.div className="bg-white relative"
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  ref={ref}
                  style={{
                    maxHeight: '70vh',
                    height:    '800px',
                    overflow:  'scroll',
                    zIndex:    1,
                  }}
      >
        {children}

        <div onClick={close}
             className={classNames(
               'svg-font',
               'cursor-pointer',
               'text-xxl',
               'absolute z-10 right-4 top-4',
               theme_ctx.classes.skin.modal.close_btn,
             )}
        >
          <XCircleSolid />
        </div>
      </motion.div>
    </div>
  )
}


const Modal = ({isOpen, close, children, onExitComplete}) => (
  <AnimatePresence initial={true}
                   exitBeforeEnter={true}
                   onExitComplete={onExitComplete}
  >
    {isOpen && (
      <ModalLayout close={close}>
        {children}
      </ModalLayout>
    )}
  </AnimatePresence>
)

export default Modal
