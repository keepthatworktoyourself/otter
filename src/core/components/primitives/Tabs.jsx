import React, {createContext, useContext, useState} from 'react'
import {classNames} from '../../helpers/style'

const TabsContext = createContext()

const TabsProvider = ({initialTabIndex = 0, options = {}, children}) => {
  const [tabIndex, setTabIndex] = useState(initialTabIndex)

  return (
    <TabsContext.Provider value={{
      tabIndex,
      setTabIndex,
      options,
    }}
    >
      {children}
    </TabsContext.Provider>
  )
}

const TabsBtn = ({Tag = 'div', index, className, render, ...props}) => {
  const {tabIndex, setTabIndex} = useContext(TabsContext)

  const privateProps = {
    onClick:   () => tabIndex !== index && setTabIndex(index),
    className: classNames(
      'cursor-pointer',
      className,
    ),
  }

  return (
    <Tag {...{...privateProps, ...props}}>
      {render && render({
        active: tabIndex === index,
      })}
      {!render && <div>TabsBtn {index}: Use render props!</div>}
    </Tag>
  )
}

const TabsTab = ({Tag = 'div', index, className, children, ...props}) => {
  const {tabIndex} = useContext(TabsContext)

  const privateProps = {
    className: classNames(
      tabIndex !== index && 'hidden',
      className,
    ),
  }

  return (
    <Tag {...{...privateProps, ...props}}>
      {children ? children : <div>TabsTab {index}: Contents</div>}
    </Tag>
  )
}

export {
  TabsProvider,
  TabsBtn,
  TabsTab,
}

