import React, {
  useState,
  useEffect /* useDeferredValue  */,
  ComponentProps,
  useDeferredValue,
} from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { Card, ConfigProvider, theme } from 'antd'
import GitHubButton, { ReactGitHubButtonProps } from 'react-github-btn'
import ReactGA from 'react-ga'
import createPersistedState from 'use-persisted-state'
import queryString from 'query-string'
import VersionSelector from '../common/VersionSelector'
import DiffViewer, { DiffViewerProps } from '../common/DiffViewer'
import Settings from '../common/Settings'
// @ts-ignore-next-line
import logo from '../../assets/logo.svg'
// @ts-ignore-next-line
import logoWhite from '../../assets/logo-white.svg'
// import { SHOW_LATEST_RCS } from '../../utils'
import { useGetLanguageFromURL } from '../../hooks/get-language-from-url'
import { useGetPackageNameFromURL } from '../../hooks/get-package-name-from-url'
import {
  DEFAULT_APP_NAME,
  DEFAULT_APP_PACKAGE,
  PACKAGE_NAMES,
} from '../../constants'
// import { TroubleshootingGuidesButton } from '../common/TroubleshootingGuidesButton'
import { DarkModeButton } from '../common/DarkModeButton'
import { updateURL } from '../../utils/update-url'
import { deviceSizes } from '../../utils/device-sizes'
import { lightTheme, darkTheme, type Theme } from '../../theme'
import pkg from '../../../package.json'
import { getChangelogURL } from '../../utils'
import { Link } from '../common/Markdown'
import { SettingsProvider } from '../../SettingsProvider'
import { ReleasesProvider } from '../../ReleaseProvider'

const homepage = pkg.homepage

const Page = styled.div<{ theme?: Theme }>`
  background-color: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 30px;
`

const Container = styled(Card)<{ theme?: Theme }>`
  background-color: ${({ theme }) => theme.background};
  width: 90%;
  border-radius: 3px;
  border-color: ${({ theme }) => theme.border};
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${deviceSizes.tablet} {
    flex-direction: row;
  }
`

const LogoImg = styled.img`
  width: 50px;
  margin-bottom: 15px;

  @media ${deviceSizes.tablet} {
    width: 100px;
  }
`

const TitleHeader = styled.h1`
  margin: 0;
  margin-left: 15px;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

// const AppNameField = styled.div`
//   width: 100%;
// `

// const AppPackageField = styled.div`
//   width: 100%;
// `

// const AppDetailsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 16px;

//   @media ${deviceSizes.tablet} {
//     flex-direction: row;
//   }
// `

const SettingsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 8px;
  flex: 1;
`

const UpdateDocsLink = styled.div`
  flex: 1;
`

const getAppInfoInURL = (): {
  appPackage: string
  appName: string
} => {
  // Parses `/?name=RnDiffApp&package=com.rndiffapp` from URL
  const { name, package: pkg } = queryString.parse(window.location.search)

  return {
    appPackage: pkg as string,
    appName: name as string,
  }
}

interface StarButtonProps extends ReactGitHubButtonProps {
  className?: string
}

const StarButton = styled(({ className, ...props }: StarButtonProps) => (
  <div className={className}>
    <GitHubButton {...props} />
  </div>
))`
  margin-top: 10px;
  margin-left: 15px;
  margin-right: auto;
`

// Set up a persisted state hook for for dark mode so users coming back
// will have dark mode automatically if they've selected it previously.
const useDarkModeState = createPersistedState<boolean>('darkMode')

const Home = () => {
  const { packageName: defaultPackageName, isPackageNameDefinedInURL } =
    useGetPackageNameFromURL()
  const defaultLanguage = useGetLanguageFromURL()
  const [packageName, setPackageName] = useState(defaultPackageName)
  const [language, setLanguage] = useState(defaultLanguage)
  const [fromVersion, setFromVersion] = useState('')
  const [toVersion, setToVersion] = useState('')
  const [shouldShowDiff, setShouldShowDiff] = useState(false)
  // const [settings, setSettings] = useState<Record<string, boolean>>({
  //   [`${SHOW_LATEST_RCS}`]: false,
  // })

  const appInfoInURL = getAppInfoInURL()
  const [appName /* setAppName */] = useState('')
  const [appPackage /*setAppPackage*/] = useState<string>(
    appInfoInURL.appPackage
  )

  // Avoid UI lag when typing.
  const deferredAppName = useDeferredValue(appName)
  const deferredAppPackage = useDeferredValue(appPackage)

  // const homepageUrl = process.env.PUBLIC_URL

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-136307971-1')
      ReactGA.pageview('/')
    }
  }, [])

  const handleShowDiff = ({
    fromVersion,
    toVersion,
  }: {
    fromVersion: string
    toVersion: string
  }) => {
    // if (fromVersion === toVersion) {
    //   return
    // }

    setFromVersion(fromVersion)
    setToVersion(toVersion)
    setShouldShowDiff(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePackageNameAndLanguageChange = ({
    newPackageName,
    newLanguage,
  }: {
    newPackageName?: string
    newLanguage: string
  }) => {
    let localPackageName =
      newPackageName === undefined ? packageName : newPackageName
    let localLanguage = newLanguage === undefined ? language : newLanguage

    updateURL({
      packageName: localPackageName,
      language: localLanguage,
      isPackageNameDefinedInURL:
        isPackageNameDefinedInURL || newPackageName !== undefined,
      toVersion: '',
      fromVersion: '',
    })
    setPackageName(localPackageName)
    setLanguage(localLanguage)
    setFromVersion('')
    setToVersion('')
    setShouldShowDiff(false)
  }

  // const handleSettingsChange = (settingsValues: string[]) => {
  //   const normalizedIncomingSettings = settingsValues.reduce((acc, val) => {
  //     acc[val] = true
  //     return acc
  //   }, {})

  //   setSettings(normalizedIncomingSettings)
  // }

  // Dark Mode Setup:
  const { defaultAlgorithm, darkAlgorithm } = theme // Get default and dark mode states from antd.
  const [isDarkMode, setIsDarkMode] = useDarkModeState(false) // Remembers dark mode state between sessions.
  const toggleDarkMode = () =>
    setIsDarkMode((previousValue: boolean) => !previousValue)
  // const themeString = isDarkMode ? 'dark' : 'light'
  useEffect(() => {
    // Set the document's background color to the theme's body color.
    document.body.style.backgroundColor = isDarkMode
      ? darkTheme.background
      : lightTheme.background
  }, [isDarkMode])
  return (
    <SettingsProvider>
      <ReleasesProvider packageName={defaultPackageName}>
        <ConfigProvider
          theme={{
            algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
          }}
        >
          <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <Page>
              <Container>
                <HeaderContainer>
                  <TitleContainer>
                    <LogoImg
                      alt="Backstage logo"
                      title="Backstage logo"
                      src={isDarkMode ? logoWhite : logo}
                    />

                    <a href={homepage}>
                      <TitleHeader>Backstage Upgrade Helper</TitleHeader>
                    </a>
                  </TitleContainer>
                  <SettingsContainer>
                    <StarButton
                      href="https://github.com/backstage/upgrade-helper"
                      data-icon="octicon-star"
                      data-show-count="true"
                      aria-label="Star backstage/upgrade-helper on GitHub"
                    >
                      Star
                    </StarButton>

                    <UpdateDocsLink>
                      <a href="https://backstage.io/docs/getting-started/keeping-backstage-updated">
                        Keeping Backstage Updated
                      </a>
                    </UpdateDocsLink>

                    <Settings />
                    <DarkModeButton
                      isDarkMode={isDarkMode}
                      onClick={toggleDarkMode}
                    />
                  </SettingsContainer>
                </HeaderContainer>

                <VersionSelector
                  key={defaultPackageName}
                  showDiff={handleShowDiff}
                  // fromVersion={fromVersion}
                  // toVersion={toVersion}
                  packageName={defaultPackageName}
                  language={defaultLanguage}
                  isPackageNameDefinedInURL={isPackageNameDefinedInURL}
                />
              </Container>
              <BackstageDiffViewer
                //@ts-expect-error - the component prop type is messed up
                shouldShowDiff={shouldShowDiff}
                fromVersion={fromVersion}
                toVersion={toVersion}
                appName={
                  deferredAppName !== DEFAULT_APP_NAME ? deferredAppName : ''
                }
                appPackage={
                  deferredAppPackage !== DEFAULT_APP_PACKAGE
                    ? deferredAppPackage
                    : ''
                }
                packageName={packageName}
                language={language}
              />
            </Page>
          </ThemeProvider>
        </ConfigProvider>
      </ReleasesProvider>
    </SettingsProvider>
  )
}

function BackstageDiffViewer(props: ComponentProps<typeof DiffViewer>) {
  const { fromVersion, toVersion } = props as unknown as DiffViewerProps

  if (fromVersion && fromVersion === toVersion) {
    return (
      <div style={{ textAlign: 'center', width: '90%' }}>
        <p>
          The selected versions share the same dependencies. This usually
          happens when a patch for one of the dependencies is released.
        </p>
        <p>
          Please refer to the{' '}
          <Link
            href={getChangelogURL({
              packageName: PACKAGE_NAMES.BACKSTAGE,
              version: toVersion,
            })}
            target="_blank"
            rel="noreferrer"
          >
            changelog
          </Link>{' '}
          to see what has changed.
        </p>
      </div>
    )
  }
  return <DiffViewer {...props} />
}

export default Home
