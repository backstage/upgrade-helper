import { useEffect, useState } from 'react'
import { parseDiff } from 'react-diff-view'
import type { File } from 'gitdiff-parser'
import { getDiffURL, USE_YARN_PLUGIN } from '../utils'
import sortBy from 'lodash/sortBy'
import { useSettings } from '../SettingsProvider'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// const movePackageJsonToTop = (parsedDiff: File[]) =>
//   parsedDiff.sort(({ newPath }) => (newPath.includes('package.json') ? -1 : 1))

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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [diff, setDiff] = useState<File[] | Error>([])

  useEffect(() => {
    const fetchDiff = async () => {
      setIsLoading(true)
      setIsDone(false)

      const [response] = await Promise.all([
        fetch(getDiffURL({ packageName, language, fromVersion, toVersion })),
        delay(300),
      ])

      const diff = await response.text()

      setDiff(applyBackstageDiff(response, parseDiff(diff)))

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

function applyBackstageDiff(response: Response, parsedDiff: File[]) {
  if (response.status === 404) {
    return new Error('Diff not found. Please reach out to the maintainers.')
  }

  return sortBy(parsedDiff, ({ newPath }: File) => {
    if (newPath.includes('package.json')) {
      return -1
    } else if (newPath === '.yarnrc.yml') {
      return 1
    } else if (newPath.startsWith('.yarn/')) {
      return 2
    }

    return 0
  }).filter(excludeYarnLock)
}

function excludeYarnLock({ oldPath, newPath }: File) {
  return !(oldPath.includes('yarn.lock') || newPath.includes('yarn.lock'))
}
