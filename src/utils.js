import semver from 'semver/preload'
import {
  RN_DIFF_REPOSITORIES,
  DEFAULT_APP_NAME,
  PACKAGE_NAMES,
  RN_CHANGELOG_URLS,
  DIFF_BASE_BRANCH
} from './constants'

const getRNDiffRepository = ({ packageName }) =>
  RN_DIFF_REPOSITORIES[packageName]
const getDiffBranch = ({ packageName }) =>
  packageName === PACKAGE_NAMES.BACKSTAGE ? 'master' : 'diffs'

export const getReleasesFileURL = ({ packageName, useYarnPlugin }) =>
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

// `path` must contain `RnDiffApp` prefix
export const getBinaryFileURL = ({ packageName, language, version, path }) => {
  const branch =
    packageName === PACKAGE_NAMES.RNM
      ? `mac/${version}`
      : packageName === PACKAGE_NAMES.RNW
      ? `${language}/${version}`
      : version

  return `https://github.com/${getRNDiffRepository({
    packageName
  })}/raw/release/${branch}/${path}`
}

export const removeAppPathPrefix = (path, appName) =>
  path.replace(new RegExp(`${appName || DEFAULT_APP_NAME}/`), '')

export const replaceWithProvidedAppName = (path, appName) => {
  if (!appName) {
    return path
  }

  return path
    .replace(new RegExp(DEFAULT_APP_NAME, 'g'), appName)
    .replace(
      new RegExp(DEFAULT_APP_NAME.toLowerCase(), 'g'),
      appName.toLowerCase()
    )
}

export const getVersionsContentInDiff = ({
  fromVersion,
  toVersion,
  versions
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

export const getChangelogURL = ({ version, packageName }) => {
  if (packageName === PACKAGE_NAMES.RNW || packageName === PACKAGE_NAMES.RNM) {
    return `${RN_CHANGELOG_URLS[packageName]}v${version}`
  }
  if (packageName === PACKAGE_NAMES.BACKSTAGE) {
    return `${RN_CHANGELOG_URLS[packageName]}v${version}`
  }

  return `${RN_CHANGELOG_URLS[packageName]}#v${version.replace('.', '')}0`
}

// If the browser is headless (running puppeteer) then it doesn't have any duration
export const getTransitionDuration = duration =>
  navigator.webdriver ? 0 : duration

// settings constants
export const SHOW_LATEST_RCS = 'Show all next releases'
export const USE_YARN_PLUGIN = 'Use yarn plugin'

export const getFilePathsToShow = ({ oldPath, newPath, appName }) => {
  const oldPathSanitized = replaceWithProvidedAppName(oldPath, appName)
  const newPathSanitized = replaceWithProvidedAppName(newPath, appName)

  return {
    oldPath: removeAppPathPrefix(oldPathSanitized, appName),
    newPath: removeAppPathPrefix(newPathSanitized, appName)
  }
}
