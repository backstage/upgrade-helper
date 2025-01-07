import { useEffect, useState } from 'react'
import { parseDiff } from 'react-diff-view'
import type { File } from 'gitdiff-parser'
import { getDiffURL, USE_YARN_PLUGIN } from '../utils'
import sortBy from 'lodash/sortBy'
import { useSettings } from '../SettingsProvider'

const excludeYarnLock = ({ oldPath, newPath, ...rest }: File) =>
  !(oldPath.includes('yarn.lock') || newPath.includes('yarn.lock'))

const applyCustomSort = (parsedDiff: File[]) =>
  sortBy(parsedDiff, ({ newPath }: File) => {
    if (newPath.includes('package.json')) {
      return -1
    } else if (newPath === '.yarnrc.yml') {
      return 1
    } else if (newPath.startsWith('.yarn/')) {
      return 2
    }

    return 0
  })

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const movePackageJsonToTop = (parsedDiff: File[]) =>
  parsedDiff.sort(({ newPath }) => (newPath.includes('package.json') ? -1 : 1))

interface UseFetchDiffProps {
  shouldShowDiff: boolean
  packageName: string
  language: string
  fromVersion: string
  toVersion: string
}
export const useFetchDiff = ({
  shouldShowDiff,
  packageName,
  language,
  fromVersion,
  toVersion,
}: UseFetchDiffProps) => {
  const {
    settings: { [USE_YARN_PLUGIN]: useYarnPlugin },
  } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [diff, setDiff] = useState<File[]>([])

  useEffect(() => {
    const fetchDiff = async () => {
      setIsLoading(true)
      setIsDone(false)

      const [response] = await Promise.all([
        fetch(
          getDiffURL({
            packageName,
            language,
            fromVersion,
            toVersion,
            useYarnPlugin,
          })
        ),
        delay(300),
      ])

      const diff = await response.text()

      setDiff(applyCustomSort(parseDiff(diff).filter(excludeYarnLock)))

      setIsLoading(false)
      setIsDone(true)

      return
    }

    if (shouldShowDiff) {
      fetchDiff()
    }
  }, [shouldShowDiff, packageName, language, fromVersion, toVersion])

  return {
    isLoading,
    isDone,
    diff,
  }
}
