import {useEffect} from 'react'

const addListeners = (el, events, listener) =>
  events.forEach(evt => el.addEventListener(evt, listener))

const removeListeners = (el, events, listener) =>
  events.forEach(evt => el.removeEventListener(evt, listener))

export default function useOnClickOutside({ref, handler, is_modal, customEvent}) {
  useEffect(
    () => {
      const listener = ev => {
        if (!ref.current || ref.current.contains(ev.target)) {
          return
        }

        if (ev.target.closest('.preventOnClickOutside')) {
          return
        }

        ev.type === 'mousedown' && ev.button === 0 && handler(ev)
        ev.type !== 'mousedown' && handler(ev)
      }

      addListeners(document, customEvent ? [customEvent] : ['mousedown', 'touchstart'], listener)
      return () => {
        removeListeners(document, customEvent ? [customEvent] : ['mousedown', 'touchstart'], listener)
      }
    },
    [ref, handler],
  )
}

// NB: Wrapping your handler in useCallback() is a possible performance optimization
