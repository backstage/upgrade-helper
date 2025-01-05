import React, { useContext, useState } from 'react'
import { useFetchReleases } from './hooks/fetch-release-versions'
import { USE_YARN_PLUGIN } from './utils'
import { useSettings } from './SettingsProvider'

export const ReleasesContext = React.createContext({
  isDone: false,
  isLoading: false,
  releases: undefined,
})

export const ReleasesProvider = React.memo(function ({
  children,
  packageName,
}) {
  const {
    settings: { [USE_YARN_PLUGIN]: useYarnPlugin },
  } = useSettings()

  const value = useFetchReleases({ packageName, useYarnPlugin })
  const [selectedVersions, setSelectedVersions] = useState()

  return (
    <ReleasesContext.Provider
      value={{ ...value, setSelectedVersions, ...selectedVersions }}
    >
      {children}
    </ReleasesContext.Provider>
  )
})

export const useReleases = () => useContext(ReleasesContext)
