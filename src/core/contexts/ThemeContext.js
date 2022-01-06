import {createContext, useContext} from 'react'
import classes from '../definitions/classes'

export const ThemeContext = createContext({classes})

export function useThemeContext() {
  return useContext(ThemeContext)
}
