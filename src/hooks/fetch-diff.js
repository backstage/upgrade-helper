import { useEffect, useState } from 'react'
import { parseDiff } from 'react-diff-view'
import sortBy from 'lodash/sortBy'
import { getDiffURL, USE_YARN_PLUGIN } from '../utils'
import { useSettings } from '../SettingsProvider'

const delay = ms => new Promise(res => setTimeout(res, ms))

const excludeYarnLock = ({ oldPath, newPath, ...rest }) =>
  !(oldPath.includes('yarn.lock') || newPath.includes('yarn.lock'))

const applyCustomSort = parsedDiff =>
  sortBy(parsedDiff, ({ newPath }) => {
    if (newPath.includes('package.json')) {
      return -1
    } else if (newPath === '.yarnrc.yml') {
      return 1
    } else if (newPath.startsWith('.yarn/')) {
      return 2
    }

    return 0
  })

export const useFetchDiff = ({
  shouldShowDiff,
  packageName,
  language,
  fromVersion,
  toVersion
}) => {
  const {
    settings: { [USE_YARN_PLUGIN]: useYarnPlugin }
  } = useSettings()
  const [isLoading, setIsLoading] = useState(true)
  const [isDone, setIsDone] = useState(false)
  const [diff, setDiff] = useState(undefined)

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
            useYarnPlugin
          })
        ),
        delay(300)
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
    diff
  }
}
