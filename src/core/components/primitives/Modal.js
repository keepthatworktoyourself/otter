import {AnimatePresence, motion} from 'framer-motion'
import {useRef} from 'react'
import XCircleSolid from 'simple-react-heroicons/icons/XCircleSolid'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import useOnClickOutside from '../../hooks/useOnClickOutside'

const Backdrop = () => {
  const theme_ctx = useThemeContext()

  return (
    <motion.div className={classNames(
      'absolute-fill',
      theme_ctx.classes.skin.modal.bg,
    )}
                initial={{opacity: 0}}
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
    <div className={classNames(
      'fixed top-0 right-0 bottom-0 left-0',
      'flex items-center justify-center',
    )}
         style={{zIndex: 99999}}
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

        <div className={classNames(
          'svg-font',
          'cursor-pointer',
          'text-xxl',
          'absolute z-10 right-4 top-4',
          theme_ctx.classes.skin.modal.close_btn,
        )}
             onClick={close}
        >
          <XCircleSolid />
        </div>
      </motion.div>
    </div>
  )
}


const Modal = ({isOpen, close, children, onExitComplete}) => (
  <AnimatePresence initial={true}
    // Only render one component at a time.
    // The exiting component will finish its exit
    // animation before entering component is rendered
                   exitBeforeEnter={true}
    // Fires when all exiting nodes have completed animating out
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





