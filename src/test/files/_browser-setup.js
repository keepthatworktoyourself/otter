import browser_env from 'browser-env'
browser_env()

global && (global.requestAnimationFrame = func => setTimeout(func))
global && (global.cancelAnimationFrame = t => clearTimeout(t))
window && (window.requestAnimationFrame = global.requestAnimationFrame)
window && (window.cancelAnimationFrame = global.cancelAnimationFrame)

