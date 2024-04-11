import { PACKAGE_NAMES } from '../constants'

export function updateURL({
  packageName,
  language,
  isPackageNameDefinedInURL,
  fromVersion,
  toVersion,
  yarnPlugin,
}: {
  packageName?: string
  language?: string
  isPackageNameDefinedInURL?: boolean
  fromVersion?: string
  toVersion?: string
  yarnPlugin?: boolean
} = {}) {
  const newURL = new URL(window.location.href)

  if (fromVersion) {
    newURL.searchParams.set('from', fromVersion)
  }
  if (appPackage) {
    url.searchParams.set('package', appPackage)
  }
  if (appName) {
    url.searchParams.set('name', appName)
  }

  if (toVersion) {
    newURL.searchParams.set('to', toVersion)
  }

  if (yarnPlugin !== undefined) {
    newURL.searchParams.set('yarnPlugin', yarnPlugin ? '1' : '0')
  }

  if (isPackageNameDefinedInURL) {
    newURL.searchParams.set('package', packageName)
  }

  if (language && packageName === PACKAGE_NAMES.RNW) {
    newURL.searchParams.set('language', language)
  }

  if (window.location.href !== newURL.toString()) {
    window.history.pushState('', '', newURL.toString())

    // The popstate event is not triggered by window.history.pushState,
    // so we need to dispatch the event ourselves in order for listeners
    // to pick it up.
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event#the_history_stacks
    dispatchEvent(new PopStateEvent('popstate'))
  }
}
