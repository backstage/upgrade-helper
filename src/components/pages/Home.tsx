import React, { useState, useEffect /* useDeferredValue  */ } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { Card, Input, Typography, ConfigProvider, theme } from 'antd'
import GitHubButton, { ReactGitHubButtonProps } from 'react-github-btn'
// import ReactGA from 'react-ga'
import createPersistedState from 'use-persisted-state'
// import queryString from 'query-string'
import VersionSelector from '../common/VersionSelector'
import DiffViewer from '../common/DiffViewer'
import Settings from '../common/Settings'
// @ts-ignore-next-line
import logo from '../../assets/logo.svg'
import { useGetLanguageFromURL } from '../../hooks/get-language-from-url'
import { useGetPackageNameFromURL } from '../../hooks/get-package-name-from-url'
import { DarkModeButton } from '../common/DarkModeButton'
import { deviceSizes } from '../../utils/device-sizes'
import { ReleasesProvider } from '../../ReleaseProvider'
import { SettingsProvider } from '../../SettingsProvider'
import { lightTheme, darkTheme, type Theme } from '../../theme'
import pkg from '../../../package.json'

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
    width: 50px;
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

const AppNameField = styled.div`
  width: 100%;
`

const AppPackageField = styled.div`
  width: 100%;
`

const AppDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${deviceSizes.tablet} {
    flex-direction: row;
  }
`

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
const useDarkModeState = createPersistedState('darkMode')

const Home = () => {
  const { packageName: defaultPackageName, isPackageNameDefinedInURL } =
    useGetPackageNameFromURL()
  const defaultLanguage = useGetLanguageFromURL()
  const [fromVersion, setFromVersion] = useState('')
  const [toVersion, setToVersion] = useState('')
  const [shouldShowDiff, setShouldShowDiff] = useState(false)
  // const [releases, setReleases] = useState({})
  const [appName /* setAppName */] = useState('')

  const homepageUrl = process.env.PUBLIC_URL

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // ReactGA.initialize('UA-136307971-1')
      // ReactGA.pageview('/')
    }
  }, [])

  const handleShowDiff = ({
    fromVersion,
    toVersion,
  }: {
    fromVersion: string
    toVersion: string
  }) => {
    if (fromVersion === toVersion) {
      return
    }

    setFromVersion(fromVersion)
    setToVersion(toVersion)
    setShouldShowDiff(true)
  }

  // Dark Mode Setup:
  const { defaultAlgorithm, darkAlgorithm } = theme // Get default and dark mode states from antd.
  const [isDarkMode, setIsDarkMode] = useDarkModeState(false) // Remembers dark mode state between sessions.
  const toggleDarkMode = () =>
    setIsDarkMode((previousValue: boolean) => !previousValue)
  const themeString = isDarkMode ? 'dark' : 'light'
  useEffect(() => {
    // Set the document's background color to the theme's body color.
    document.body.style.backgroundColor = isDarkMode
      ? darkTheme.background
      : lightTheme.background
  }, [isDarkMode])
  debugger
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
                      src={logo}
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
                  fromVersion={fromVersion}
                  toVersion={toVersion}
                  packageName={defaultPackageName}
                  language={defaultLanguage}
                  isPackageNameDefinedInURL={isPackageNameDefinedInURL}
                />
              </Container>
              <DiffViewer
                shouldShowDiff={shouldShowDiff}
                fromVersion={fromVersion}
                toVersion={toVersion}
                appName={appName}
                packageName={defaultPackageName}
                language={defaultLanguage}
              />
            </Page>
          </ThemeProvider>
        </ConfigProvider>
      </ReleasesProvider>
    </SettingsProvider>
  )
}

export default Home
