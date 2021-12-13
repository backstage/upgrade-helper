import { PACKAGE_NAMES } from '../constants'
import { getVersionsContentInDiff } from '../utils'

const fixtureVersions = ['0.59', '0.58', '0.57', '0.56'].map(version => ({
  version
}))
describe('getVersionsContentInDiff', () => {
  it('returns the versions in the provided range', () => {
    const versions = getVersionsContentInDiff({
      packageName: PACKAGE_NAMES.RN,
      fromVersion: '0.57.0',
      toVersion: '0.59.0',
      versions: fixtureVersions
    })

    expect(versions).toEqual([{ version: '0.59' }, { version: '0.58' }])
  })

  it('returns the versions in the provided range with release candidates', () => {
    const versions = getVersionsContentInDiff({
      packageName: PACKAGE_NAMES.RN,
      fromVersion: '0.56.0',
      toVersion: '0.59.0-rc.1',
      versions: fixtureVersions
    })

    expect(versions).toEqual([
      { version: '0.59' },
      { version: '0.58' },
      { version: '0.57' }
    ])
  })

  it('returns the versions in the provided range with patches specified', () => {
    const versions = getVersionsContentInDiff({
      packageName: PACKAGE_NAMES.RN,
      fromVersion: '0.57.2',
      toVersion: '0.59.9',
      versions: fixtureVersions
    })

    expect(versions).toEqual([{ version: '0.59' }, { version: '0.58' }])
  })
})
