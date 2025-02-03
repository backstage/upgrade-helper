import React, { useContext, useState } from 'react'
import { USE_YARN_PLUGIN } from './utils'
import { useSettings } from './SettingsProvider'
import { ReleaseT } from './releases/types'
import { useFetchReleaseVersions } from './hooks/fetch-release-versions'

export const ReleasesContext = React.createContext<{
  isDone: boolean
  isLoading: boolean
  releases: ReleaseT[]
  from?: ReleaseT
  to?: ReleaseT
  setSelectedVersions: (selectedVersions: any) => void
}>({
  isDone: false,
  isLoading: false,
  releases: [],
  setSelectedVersions: () => {},
})

export const ReleasesProvider = React.memo(function ({
  children,
  packageName,
}: {
  children: React.ReactNode
  packageName: string
}) {
  const {
    settings: { [USE_YARN_PLUGIN]: useYarnPlugin },
  } = useSettings()

  const value = useFetchReleaseVersions({ packageName, useYarnPlugin })
  const [selectedVersions, setSelectedVersions] = useState<{
    from?: ReleaseT
    to?: ReleaseT
  }>({})

  return (
    <ReleasesContext.Provider
      value={{ ...value, setSelectedVersions, ...selectedVersions }}
    >
      {children}
    </ReleasesContext.Provider>
  )
})

export const useReleases = () => useContext(ReleasesContext)
