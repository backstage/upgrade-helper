import semver from 'semver/preload'
import {
  RN_DIFF_REPOSITORIES,
  DEFAULT_APP_NAME,
  DEFAULT_APP_PACKAGE,
  PACKAGE_NAMES,
  RN_CHANGELOG_URLS,
  DIFF_BASE_BRANCH
} from './constants'

const getRNDiffRepository = ({ packageName }: { packageName: string }) =>
  RN_DIFF_REPOSITORIES[packageName]
const getDiffBranch = ({ packageName }) =>
  packageName === PACKAGE_NAMES.BACKSTAGE ? 'master' : 'diffs'

export const getReleasesFileURL = ({ packageName, useYarnPlugin }: { packageName: string, useYarnPlugin:boolean }) =>
  `https://raw.githubusercontent.com/${getRNDiffRepository({
    packageName
  })}/${DIFF_BASE_BRANCH}/${
    packageName === PACKAGE_NAMES.BACKSTAGE
      ? useYarnPlugin
        ? 'releases-yarn-plugin.json'
        : 'releases.json'
      : packageName === PACKAGE_NAMES.RNM
      ? 'RELEASES_MAC'
      : packageName === PACKAGE_NAMES.RNM
      ? 'RELEASES_MAC'
      : 'RELEASES'
  }`

export const getDiffURL = ({
  packageName,
  language,
  fromVersion,
  toVersion,
  useYarnPlugin
}: {
  packageName: string
  language: string
  fromVersion: string
  toVersion: string
  useYarnPlugin: boolean
}) => {
  // eslint-disable-next-line no-unused-vars
  const languageDir =
    packageName === PACKAGE_NAMES.RNM
      ? 'mac/'
      : packageName === PACKAGE_NAMES.RNW
      ? `${language}/`
      : ''

  return `https://raw.githubusercontent.com/${getRNDiffRepository({
    packageName
  })}/${getDiffBranch({ packageName })}/${
    useYarnPlugin ? 'diffs-yarn-plugin' : 'diffs'
  }/${fromVersion}..${toVersion}.diff`
}

const getBranch = ({
  packageName,
  language,
  version,
}: {
  packageName: string
  language?: string
  version: string
}) =>
  packageName === PACKAGE_NAMES.RNM
    ? `mac/${version}`
    : packageName === PACKAGE_NAMES.RNW
    ? `${language}/${version}`
    : version

interface GetBinaryFileURLProps {
  packageName: string
  language?: string
  version: string
  path: string
}
// `path` must contain `RnDiffApp` prefix
export const getBinaryFileURL = ({
  packageName,
  language,
  version,
  path,
}: GetBinaryFileURLProps) => {
  const branch = getBranch({ packageName, language, version })

  return `https://raw.githubusercontent.com/${getRNDiffRepository({
    packageName,
  })}/release/${branch}/${path}`
}

export const removeAppPathPrefix = (path: string, appName = DEFAULT_APP_NAME) =>
  path.replace(new RegExp(`${appName}/`), '')

/**
 * Replaces DEFAULT_APP_PACKAGE and DEFAULT_APP_NAME in str with custom
 * values if provided.
 * str could be a path, or content from a text file.
 */
export const replaceAppDetails = (
  str: string,
  appName?: string,
  appPackage?: string
) => {
  const appNameOrFallback = appName || DEFAULT_APP_NAME
  const appPackageOrFallback =
    appPackage || `com.${appNameOrFallback.toLowerCase()}`

  return str
    .replaceAll(DEFAULT_APP_PACKAGE, appPackageOrFallback)
    .replaceAll(
      DEFAULT_APP_PACKAGE.replaceAll('.', '/'),
      appPackageOrFallback.replaceAll('.', '/')
    )
    .replaceAll(DEFAULT_APP_NAME, appNameOrFallback)
    .replaceAll(DEFAULT_APP_NAME.toLowerCase(), appNameOrFallback.toLowerCase())
}

export const getVersionsContentInDiff = ({
  fromVersion,
  toVersion,
  versions
}: {
  packageName: string
  fromVersion: string
  toVersion: string
  versions: any[] // TODO: type this
}) => {
  const cleanedToVersion = semver.valid(semver.coerce(toVersion))

  return versions.filter(({ version }) => {
    const cleanedVersion = semver.coerce(version)
    const isPreRelease = semver.prerelease(version)

    // `cleanedVersion` can't be newer than `cleanedToVersion` nor older (or equal) than `fromVersion`
    return (
      !isPreRelease &&
      semver.compare(cleanedToVersion, cleanedVersion) !== -1 &&
      ![0, -1].includes(semver.compare(cleanedVersion, fromVersion))
    )
  })
}

export const getChangelogURL = ({
  version,
  packageName,
}: {
  version: string
  packageName: string
}) => {
  if (packageName === PACKAGE_NAMES.RNW || packageName === PACKAGE_NAMES.RNM) {
    return `${RN_CHANGELOG_URLS[packageName]}v${version}`
  }
  if (packageName === PACKAGE_NAMES.BACKSTAGE) {
    return `${RN_CHANGELOG_URLS[packageName]}v${version}`
  }

  return `${RN_CHANGELOG_URLS[packageName]}#v${version.replaceAll('.', '')}`
}

// If the browser is headless (running puppeteer) then it doesn't have any duration
export const getTransitionDuration = (duration: number) =>
  navigator.webdriver ? 0 : duration

// settings constants
export const SHOW_LATEST_RCS = 'Show all next releases'
export const USE_YARN_PLUGIN = 'Use yarn plugin'

/**
 * Returns the file paths to display for each side of the diff. Takes into account
 * custom app name and package, and truncates the leading app name to provide
 * paths relative to the project directory.
 */
export const getFilePathsToShow = ({
  oldPath,
  newPath,
  appName,
  appPackage,
}: {
  oldPath: string
  newPath: string
  appName?: string
  appPackage?: string
}) => {
  const oldPathSanitized = replaceAppDetails(oldPath, appName, appPackage)
  const newPathSanitized = replaceAppDetails(newPath, appName, appPackage)

  return {
    oldPath: removeAppPathPrefix(oldPathSanitized, appName),
    newPath: removeAppPathPrefix(newPathSanitized, appName),
  }
}
