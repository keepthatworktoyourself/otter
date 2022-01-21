import {createContext, useContext} from 'react'

export const PageDataContext = createContext()

export function usePageData() {
  return useContext(PageDataContext)
}
