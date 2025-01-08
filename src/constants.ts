export const DEFAULT_APP_NAME = 'backstagediffapp'

export const PACKAGE_NAMES = {
  RN: 'react-native',
  RNM: 'react-native-macos',
  RNW: 'react-native-windows',
  BACKSTAGE: '@backstage/create-app',
}

export const LANGUAGE_NAMES = {
  CPP: 'cpp',
  CS: 'cs',
}

export const RN_DIFF_REPOSITORIES = {
  [PACKAGE_NAMES.RN]: 'react-native-community/rn-diff-purge',
  [PACKAGE_NAMES.RNM]: 'acoates-ms/rnw-diff',
  [PACKAGE_NAMES.RNW]: 'acoates-ms/rnw-diff',
  [PACKAGE_NAMES.BACKSTAGE]: 'backstage/upgrade-helper-diff',
}

export const RN_CHANGELOG_URLS = {
  [PACKAGE_NAMES.RN]:
    'https://github.com/facebook/react-native/blob/main/CHANGELOG.md',
  [PACKAGE_NAMES.RNM]:
    'https://github.com/microsoft/react-native-macos/releases/tag/',
  [PACKAGE_NAMES.RNW]:
    'https://github.com/microsoft/react-native-windows/releases/tag/react-native-windows_',
  [PACKAGE_NAMES.BACKSTAGE]:
    'https://github.com/backstage/backstage/releases/tag/',
}

export const DIFF_BASE_BRANCH =
  process.env.REACT_APP_DIFF_BASE_BRANCH || 'master'
