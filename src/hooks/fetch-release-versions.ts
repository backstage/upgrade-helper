import { useEffect, useState } from 'react'
import { getReleasesFileURL } from '../utils'
import compare from 'semver/functions/rcompare'

export const useFetchReleaseVersions = ({
  packageName,
}: {
  packageName: string
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [releaseVersions, setReleaseVersions] = useState<string[]>([])

  useEffect(() => {
    const fetchReleaseVersions = async () => {
      setIsLoading(true)
      setIsDone(false)
      const response = await (
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
    releaseVersions,
  }
}
