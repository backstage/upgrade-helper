import React, { useCallback, useContext } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import useSearchParam from 'react-use/lib/useSearchParam'

import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from './utils'
import { updateURL } from './utils/update-url'

const INITIAL_STATE = {
  [`${SHOW_LATEST_RCS}`]: false
}

export const SettingsContext = React.createContext(INITIAL_STATE)

export const SettingsProvider = React.memo(function({ children }) {
  const useYarnPlugin = useSearchParam('yarnPlugin')

  const [settings, setLocalStorageSettings] = useLocalStorage(
    'backstage:upgrade-helper:settings',
    INITIAL_STATE
  )

  const setUseYarnPlugin = useYarnPlugin => {
    updateURL({ yarnPlugin: useYarnPlugin })
  }

  const setSettings = useCallback(settings => {
    const {
      [USE_YARN_PLUGIN]: newUseYarnPlugin,
      ...localStorageSettings
    } = settings

    if (newUseYarnPlugin !== useYarnPlugin) {
      setUseYarnPlugin(newUseYarnPlugin)
    }

    setLocalStorageSettings(localStorageSettings)
  })

  return (
    <SettingsContext.Provider
      value={{
        settings: {
          ...settings,
          [USE_YARN_PLUGIN]: !!JSON.parse(useYarnPlugin)
        },
        setSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
})

export const useSettings = () => useContext(SettingsContext)
