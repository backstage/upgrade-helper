import { PACKAGE_NAMES } from '../constants'

export function updateURL({
  packageName,
  language,
  isPackageNameDefinedInURL,
  fromVersion,
  toVersion,
  yarnPlugin
} = {}) {
  const newURL = new URL(window.location.href)

  if (fromVersion) {
    newURL.searchParams.set('fromVersion', fromVersion)
  }

  if (toVersion) {
    newURL.searchParams.set('toVersion', toVersion)
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

  window.history.pushState('', '', newURL.toString())

  // The popstate event is not triggered by window.history.pushState,
  // so we need to dispatch the event ourselves in order for listeners
  // to pick it up.
  //
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event#the_history_stacks
  dispatchEvent(new PopStateEvent('popstate'))
}
