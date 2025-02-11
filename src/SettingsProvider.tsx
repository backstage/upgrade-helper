import React, { ReactNode, useContext, useEffect } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import useSearchParam from 'react-use/lib/useSearchParam'

import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from './utils'
import { updateURL } from './utils/update-url'

interface SETTINGS {
  [SHOW_LATEST_RCS]: boolean
  [USE_YARN_PLUGIN]: boolean
}

type State = {
  settings: SETTINGS
  setSettings(settings: SETTINGS): void
}
const INITIAL_STATE = {
  settings,
  setSettings,
}

export const SettingsContext = React.createContext(INITIAL_STATE)

export const SettingsProvider = React.memo(function ({
  children,
}: {
  children: ReactNode
}) {
  const useYarnPluginParam = useSearchParam('yarnPlugin')
  const shouldPopulateYarnPluginParam = useYarnPluginParam === null
  const useYarnPlugin =
    !shouldPopulateYarnPluginParam ? !!Number(useYarnPluginParam) : false

  const [settings, setLocalStorageSettings] = useLocalStorage(
    'backstage:upgrade-helper:settings',
    INITIAL_STATE.settings
  )

  useEffect(() => {
    if (shouldPopulateYarnPluginParam) {
      updateURL({ yarnPlugin: settings?.[USE_YARN_PLUGIN] ?? false })
    }
  }, [shouldPopulateYarnPluginParam])

  const setSettings = (settings: SETTINGS) => {
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
