import React, { ReactNode, useContext } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import useSearchParam from 'react-use/lib/useSearchParam'

import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from './utils'
import { updateURL } from './utils/update-url'

const INITIAL_STATE = {
  settings: {
    [`${SHOW_LATEST_RCS}`]: false,
    [`${USE_YARN_PLUGIN}`]: false,
  },
  setSettings: (setting: any) => {},
}

export const SettingsContext = React.createContext(INITIAL_STATE)

export const SettingsProvider = React.memo(function ({
  children,
}: {
  children: ReactNode
}) {
  const useYarnPluginParam = useSearchParam('yarnPlugin')
  const useYarnPlugin =
    useYarnPluginParam !== null ? !!Number(useYarnPluginParam) : false

  const [settings, setLocalStorageSettings] = useLocalStorage(
    'backstage:upgrade-helper:settings',
    INITIAL_STATE.settings
  )

  const setSettings = (settings: typeof INITIAL_STATE.settings) => {
    const { [USE_YARN_PLUGIN]: newUseYarnPlugin, ...localStorageSettings } =
      settings

    if (newUseYarnPlugin !== useYarnPlugin) {
      updateURL({ yarnPlugin: newUseYarnPlugin })
    }

    setLocalStorageSettings({
      [USE_YARN_PLUGIN]: newUseYarnPlugin,
      ...localStorageSettings,
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: {
          ...settings!,
          [USE_YARN_PLUGIN]: useYarnPlugin,
        },
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
})

export const useSettings = () => useContext(SettingsContext)
