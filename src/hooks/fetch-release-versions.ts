import { useEffect, useState } from 'react'
import { getReleasesFileURL } from '../utils'
import compare from 'semver/functions/rcompare'
import { ReleaseT } from '../releases/types'

export const useFetchReleaseVersions = ({
  packageName,
  useYarnPlugin,
}: {
  packageName: string
  useYarnPlugin: boolean
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isDone, setIsDone] = useState(false)
  const [releases, setReleases] = useState<ReleaseT[]>([])

  useEffect(() => {
    const fetchReleaseVersions = async () => {
      setIsLoading(true)
      setIsDone(false)
      type ReleaseResponse = {
        [version: string]: {
          createApp: string
        }
      }

      const response: ReleaseResponse = await (
        await fetch(getReleasesFileURL({ packageName, useYarnPlugin }))
      ).json()

      const _releases = Object.entries(response)
        .map(([version, value]) => ({ version, ...value }))
        .sort((a, b) => compare(a.version, b.version))
      setReleases(_releases)

      setIsLoading(false)
      setIsDone(true)

      return
    }

    fetchReleaseVersions()
  }, [packageName, useYarnPlugin])

  return {
    isLoading,
    isDone,
    releases,
  }
}
