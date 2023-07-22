import React, { useState, useEffect, useDeferredValue } from 'react'
import styled from '@emotion/styled'
import { Card, Input, Typography } from 'antd'
import GitHubButton from 'react-github-btn'
// import ReactGA from 'react-ga'
import VersionSelector from '../common/VersionSelector'
import DiffViewer from '../common/DiffViewer'
import Settings from '../common/Settings'
import logo from '../../assets/logo.svg'
import { useGetLanguageFromURL } from '../../hooks/get-language-from-url'
import { useGetPackageNameFromURL } from '../../hooks/get-package-name-from-url'
import { deviceSizes } from '../../utils/device-sizes'
import { ReleasesProvider } from '../../ReleaseProvider'
import { SettingsProvider } from '../../SettingsProvider'

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 30px;
`

const Container = styled(Card)`
  width: 90%;
  border-radius: 3px;
  border-color: #e8e8e8;
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

  @media ${deviceSizes.tablet} {
    padding-right: 5px;
  }
`

const AppPackageField = styled.div`
  width: 100%;

  @media ${deviceSizes.tablet} {
    padding-left: 5px;
  }
`

const AppDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;

  @media ${deviceSizes.tablet} {
    flex-direction: row;
    gap: 0;
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

const StarButton = styled(({ className, ...props }) => (
  <div className={className}>
    <GitHubButton {...props} />
  </div>
))`
  margin-top: 10px;
  margin-left: 15px;
  margin-right: auto;
`

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

  const handleShowDiff = ({ fromVersion, toVersion }) => {
    if (fromVersion === toVersion) {
      return
    }

    setFromVersion(fromVersion)
    setToVersion(toVersion)
    setShouldShowDiff(true)
  }

  return (
    <SettingsProvider>
      <ReleasesProvider packageName={defaultPackageName}>
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
      </ReleasesProvider>
    </SettingsProvider>
  )
}

export default Home
