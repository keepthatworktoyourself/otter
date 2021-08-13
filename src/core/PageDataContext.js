import React, {useContext} from 'react'

const PageDataContext = React.createContext()
export default PageDataContext
export function usePageData() {
  return useContext(PageDataContext)
}

