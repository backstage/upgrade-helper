import React, { useCallback, useContext } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'

import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from './utils'

const INITIAL_STATE = {
  [`${SHOW_LATEST_RCS}`]: false,
  [`${USE_YARN_PLUGIN}`]: false
}

export const SettingsContext = React.createContext(INITIAL_STATE)

export const SettingsProvider = React.memo(function({ children }) {
  const [settings, setLocalStorageSettings] = useLocalStorage(
    'backstage:upgrade-helper:settings',
    INITIAL_STATE
  )

  const setSettings = useCallback(settings => {
    setLocalStorageSettings(settings)
  })

  return (
    <SettingsContext.Provider
      value={{
        settings: {
          ...settings
        },
        setSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
})

export const useSettings = () => useContext(SettingsContext)
