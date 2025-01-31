import React, { Fragment, useState, useMemo, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { Popover } from 'antd'
import semver from 'semver/preload'
import { useSearchParam } from 'react-use'
import { Select } from './'
import UpgradeButton from './UpgradeButton'
// import { useFetchReleaseVersions } from '../../hooks/fetch-release-versions'
import { updateURL } from '../../utils/update-url'
import { deviceSizes } from '../../utils/device-sizes'
import { useReleases } from '../../ReleaseProvider'
import { useSettings } from '../../SettingsProvider'
import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from '../../utils'
import type { SelectProps } from './Select'
// import queryString from 'query-string'
import { ReleaseT } from '../../releases/types'

export const testIDs = {
  fromVersionSelector: 'fromVersionSelector',
  toVersionSelector: 'toVersionSelector',
}

const Selectors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${deviceSizes.tablet} {
    flex-direction: row;
  }
`

const FromVersionSelector = styled(Select)``

interface ToVersionSelectorProps extends SelectProps {
  popover?: React.ReactNode
}

const ToVersionSelector = styled(
  ({ popover, ...props }: ToVersionSelectorProps) =>
    popover ? (
      // @ts-ignore-next-line
      React.cloneElement(popover, {
        children: <Select {...props} />,
      })
    ) : (
      <Select {...props} />
    )
)``

// const getVersionsInURL = (): {
//   fromVersion: string
//   toVersion: string
// } => {
//   // Parses `/?from=VERSION&to=VERSION` from URL
//   const { from: fromVersion, to: toVersion } = queryString.parse(
//     window.location.search
//   )

//   return {
//     fromVersion: fromVersion as string,
//     toVersion: toVersion as string,
//   }
// }

// Users making changes to version should not retain anchor links
// to files that may or may not change.
const stripAnchorInUrl = () => {
  if (window.location.hash) {
    const url = new URL(window.location.toString())
    url.hash = ''
    window.history.pushState({}, '', url)
  }
  return true
}

const compareReleaseCandidateVersions = ({
  version,
  versionToCompare,
}: {
  version: string | semver.SemVer
  versionToCompare: string | semver.SemVer
}) =>
  ['prerelease', 'prepatch', null].includes(
    semver.diff(version, versionToCompare)
  )

const getLatestMajorReleaseVersion = (releasedVersions: ReleaseT[]) =>
  semver.valid(
    semver.coerce(
      releasedVersions.find(
        ({ createApp: releasedVersion }) =>
          !semver.prerelease(releasedVersion) &&
          semver.patch(releasedVersion) === 0
      )?.version
    )
  )

// Check if `from` rc version is one of the latest major release (ie. 0.60.0)
const checkIfVersionIsALatestPrerelease = ({
  version,
  latestVersion,
}: {
  version: string
  latestVersion: string
}) =>
  semver.prerelease(version) &&
  compareReleaseCandidateVersions({
    version: latestVersion,
    versionToCompare: version,
  })

// Filters out release candidates from `releasedVersion` with the
// exception of the release candidates from the latest version
const getReleasedVersionsWithCandidates = ({
  releasedVersions,
  toVersion,
  latestVersion,
  showReleaseCandidates,
}: {
  releasedVersions: ReleaseT[]
  toVersion: ReleaseT | string
  latestVersion: string
  showReleaseCandidates: boolean
}) => {
  const toVersionString =
    typeof toVersion == 'string' ? toVersion : toVersion.version
  const isToVersionAReleaseCandidate =
    semver.prerelease(toVersionString) !== null
  const isLatestAReleaseCandidate = semver.prerelease(latestVersion) !== null

  return releasedVersions.filter(({ version: releasedVersion }) => {
    // Show the release candidates of the latest version
    const isNotLatestReleaseCandidate =
      showReleaseCandidates &&
      !checkIfVersionIsALatestPrerelease({
        version: releasedVersion,
        latestVersion,
      })

    const isLatestReleaseCandidate = checkIfVersionIsALatestPrerelease({
      version: releasedVersion,
      latestVersion,
    })

    return (
      isLatestReleaseCandidate ||
      isNotLatestReleaseCandidate ||
      semver.prerelease(releasedVersion) === null ||
      (isToVersionAReleaseCandidate &&
        compareReleaseCandidateVersions({
          version: toVersionString,
          versionToCompare: releasedVersion,
        })) ||
      (isLatestAReleaseCandidate &&
        compareReleaseCandidateVersions({
          version: latestVersion,
          versionToCompare: releasedVersion,
        }))
    )
  })
}

const getReleasedVersions = ({
  releasedVersions,
  minVersion,
  maxVersion,
}: {
  releasedVersions: ReleaseT[]
  minVersion?: string
  maxVersion?: string
}) => {
  const latestMajorReleaseVersion =
    getLatestMajorReleaseVersion(releasedVersions)

  const isVersionAReleaseAndOfLatest = (version: string) =>
    version.includes('next') &&
    semver.valid(semver.coerce(version)) === latestMajorReleaseVersion

  return releasedVersions.filter(
    ({ version: releasedVersion }) =>
      releasedVersion.length > 0 &&
      ((maxVersion && semver.lt(releasedVersion, maxVersion)) ||
        (minVersion &&
          semver.gt(releasedVersion, minVersion) &&
          !isVersionAReleaseAndOfLatest(releasedVersion)))
  )
}

// Finds the first specified release (patch, minor, major) when compared to another version
const getFirstRelease = (
  {
    releasedVersions,
    versionToCompare,
  }: {
    releasedVersions: string[]
    versionToCompare: string
  },
  type = 'minor'
) =>
  releasedVersions.find(
    (releasedVersion) =>
      semver.lt(releasedVersion, versionToCompare) &&
      semver.diff(
        semver.valid(semver.coerce(releasedVersion)) ?? '',
        semver.valid(semver.coerce(versionToCompare)) ?? ''
      ) === type
  )

// Return if version exists in the ones returned from GitHub
const doesVersionExist = ({
  version,
  allVersions,
  minVersion,
}: {
  version: string
  allVersions: string[]
  minVersion?: string
}) => {
  try {
    return (
      version &&
      allVersions.includes(version) &&
      // Also compare the version against a `minVersion`, this is used
      // to not allow the user to have a `fromVersion` newer than `toVersion`
      (!minVersion || (minVersion && semver.gt(version, minVersion)))
    )
  } catch (_error) {
    return false
  }
}

const getDefaultToVersion = (releases: any[]) => releases[0]

const getDefaultFromVersion = (
  toVersion: ReleaseT,
  releases: ReleaseT[],
  showReleaseCandidates: boolean
) => {
  // Remove `rc` versions from the array of versions
  const sanitizedVersionsWithReleases = getReleasedVersionsWithCandidates({
    releasedVersions: releases,
    toVersion,
    latestVersion: releases[0].version,
    showReleaseCandidates,
  })

  const sanitizedVersions = sanitizedVersionsWithReleases.map(
    ({ version }) => version
  )

  const version =
    getFirstRelease(
      {
        releasedVersions: sanitizedVersions,
        versionToCompare: toVersion.version,
      },
      'minor'
    ) ||
    getFirstRelease(
      {
        releasedVersions: sanitizedVersions,
        versionToCompare: toVersion.version,
      },
      'patch'
    )

  return sanitizedVersionsWithReleases.find(
    (value) => value.version === version
  )
}

const VersionSelector = ({
  packageName,
  language,
  isPackageNameDefinedInURL,
  showDiff,
}: {
  packageName: string
  language: string
  isPackageNameDefinedInURL: boolean
  showDiff: (args: { fromVersion: string; toVersion: string }) => void
}) => {
  const {
    settings: {
      [SHOW_LATEST_RCS]: showReleaseCandidates,
      [USE_YARN_PLUGIN]: useYarnPlugin,
    },
  } = useSettings()
  const [allVersions, setAllVersions] = useState<ReleaseT[]>([])
  const [fromVersionList, setFromVersionList] = useState<ReleaseT[]>([])
  const [toVersionList, setToVersionList] = useState<ReleaseT[]>([])
  const [hasVersionsFromURL, setHasVersionsFromURL] = useState<boolean>(false)

  const [localFromVersion, setLocalFromVersion] = useState<string>('')
  const [localToVersion, setLocalToVersion] = useState<string>('')

  const upgradeButtonEl = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const { isDone, isLoading, releases, setSelectedVersions } = useReleases()
  const releaseVersions = useMemo(
    () => releases?.map(({ version }) => version),
    [releases]
  )

  const fromVersion = useSearchParam('from') || ''
  const toVersion = useSearchParam('to') || ''

  useEffect(() => {
    const fetchVersions = async () => {
      // Check if the versions provided in the URL are valid
      const hasFromVersionInURL = doesVersionExist({
        version: fromVersion,
        allVersions: releaseVersions,
      })

      const hasToVersionInURL = doesVersionExist({
        version: toVersion,
        allVersions: releaseVersions,
        minVersion: fromVersion,
      })

      const latestVersion = releaseVersions[0]
      // If the version from URL is not valid then fallback to the latest
      const toVersionToBeSet = hasToVersionInURL ? toVersion : latestVersion

      // Remove `rc` versions from the array of versions
      const sanitizedVersionsWithReleases = getReleasedVersionsWithCandidates({
        releasedVersions: releases,
        toVersion: toVersionToBeSet,
        latestVersion,
        showReleaseCandidates,
      })

      const sanitizedVersions = sanitizedVersionsWithReleases.map(
        ({ version }) => version
      )

      setAllVersions(sanitizedVersionsWithReleases)

      const fromVersionToBeSet = hasFromVersionInURL
        ? fromVersion
        : // Get first major release before latest
          getFirstRelease(
            {
              releasedVersions: sanitizedVersions,
              versionToCompare: toVersionToBeSet,
            },
            'minor'
          ) ||
          getFirstRelease(
            {
              releasedVersions: sanitizedVersions,
              versionToCompare: toVersionToBeSet,
            },
            'patch'
          )

      setFromVersionList(
        getReleasedVersions({
          releasedVersions: sanitizedVersionsWithReleases,
          maxVersion: toVersionToBeSet,
        })
      )
      setToVersionList(
        getReleasedVersions({
          releasedVersions: sanitizedVersionsWithReleases,
          minVersion: fromVersionToBeSet,
        })
      )

      setLocalFromVersion(fromVersionToBeSet ?? '')
      setLocalToVersion(toVersionToBeSet)

      const doesHaveVersionsInURL = hasFromVersionInURL && hasToVersionInURL

      setHasVersionsFromURL(!!doesHaveVersionsInURL)
    }

    if (isDone) {
      fetchVersions()
    }
  }, [
    fromVersion,
    toVersion,
    isDone,
    releaseVersions,
    setLocalFromVersion,
    setLocalToVersion,
    showReleaseCandidates,
  ])

  useEffect(() => {
    if (isLoading) {
      return
    }

    setFromVersionList(
      getReleasedVersions({
        releasedVersions: allVersions,
        maxVersion: localToVersion,
      })
    )
    setToVersionList(
      getReleasedVersions({
        releasedVersions: allVersions,
        minVersion: localFromVersion,
      })
    )

    if (hasVersionsFromURL) {
      upgradeButtonEl?.current?.click()
    }
  }, [
    isLoading,
    allVersions,
    localFromVersion,
    localToVersion,
    hasVersionsFromURL,
    releases,
    showReleaseCandidates,
  ])

  const onShowDiff = () => {
    const resolveDiffVersion = (targetVersion: string) =>
      releases.find((r) => r.version === targetVersion)

    const to =
      resolveDiffVersion(localToVersion) || getDefaultToVersion(releases)
    const from =
      resolveDiffVersion(localFromVersion) ||
      getDefaultFromVersion(to, releases, showReleaseCandidates)

    setSelectedVersions({
      from,
      to,
    })

    showDiff({
      fromVersion: from?.[useYarnPlugin ? 'version' : 'createApp'] || '',
      toVersion: to[useYarnPlugin ? 'version' : 'createApp'],
    })

    updateURL({
      packageName,
      language,
      isPackageNameDefinedInURL,
      fromVersion: localFromVersion,
      toVersion: localToVersion,
      // appPackage,
      // appName,
    })
  }

  return (
    <Fragment>
      <Selectors>
        <FromVersionSelector
          key={'from-' + useYarnPlugin}
          showSearch
          data-testid={testIDs.fromVersionSelector}
          title={`What's your current Backstage version?`}
          loading={isLoading}
          value={localFromVersion}
          options={fromVersionList}
          onChange={(chosenVersion) =>
            stripAnchorInUrl() && setLocalFromVersion(chosenVersion)
          }
        />

        <ToVersionSelector
          key={'to-' + useYarnPlugin}
          showSearch
          data-testid={testIDs.toVersionSelector}
          title="To which version would you like to upgrade?"
          loading={isLoading}
          value={localToVersion}
          options={toVersionList}
          popover={
            localToVersion === '0.60.1' && (
              <Popover
                open={true}
                placement="topLeft"
                content="We recommend using the latest 0.60 patch release instead of 0.60.1."
              />
            )
          }
          onChange={(chosenVersion) =>
            stripAnchorInUrl() && setLocalToVersion(chosenVersion)
          }
        />
      </Selectors>

      <UpgradeButton ref={upgradeButtonEl} onShowDiff={onShowDiff} />
    </Fragment>
  )
}

export default VersionSelector
