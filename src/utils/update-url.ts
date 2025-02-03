import { PACKAGE_NAMES } from '../constants'

export function updateURL(
  {
    packageName,
    language,
    isPackageNameDefinedInURL,
    fromVersion,
    toVersion,
    appPackage,
    appName,
    yarnPlugin,
  }: {
    packageName?: string
    language?: string
    isPackageNameDefinedInURL?: boolean
    fromVersion?: string
    toVersion?: string
    appPackage?: string
    appName?: string
    yarnPlugin?: boolean
  } = { packageName: PACKAGE_NAMES.BACKSTAGE }
) {
  const url = new URL(window.location.href)

  if (fromVersion) {
    url.searchParams.set('from', fromVersion)
  }
  if (toVersion) {
    url.searchParams.set('to', toVersion)
  }
  if (isPackageNameDefinedInURL && packageName) {
    url.searchParams.set('package', packageName)
  }
  if (packageName === PACKAGE_NAMES.RNW && language) {
    url.searchParams.set('language', language)
  }
  if (appPackage) {
    url.searchParams.set('package', appPackage)
  }
  if (appName) {
    url.searchParams.set('name', appName)
  }

  if (yarnPlugin !== undefined) {
    url.searchParams.set('yarnPlugin', yarnPlugin ? '1' : '0')
  }

  if (window.location.href !== url.toString()) {
    window.history.pushState('', '', url.toString())

    // The popstate event is not triggered by window.history.pushState,
    // so we need to dispatch the event ourselves in order for listeners
    // to pick it up.
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event#the_history_stacks
    dispatchEvent(new PopStateEvent('popstate'))
  }
}
