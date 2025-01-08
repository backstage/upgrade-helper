import React, { useEffect, useState } from 'react'
import MarkdownComponent from '../common/Markdown'
import { useParams } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { lightTheme, darkTheme, type Theme } from '../../theme'
import { Card } from 'antd'
import { deviceSizes } from '../../utils/device-sizes'
// @ts-ignore-next-line
import logo from '../../assets/logo.svg'

const Page = styled.div<{ theme?: Theme }>`
  background-color: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  padding-top: 30px;
  min-height: 100vh;
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

const Changelogs = () => {
  const { scope, packageName, version } = useParams()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch(
          `https://www.npmjs.com/package/${
            scope ? `${scope}/${packageName}` : `${packageName}`
          }/v/${version}/index`
          // /v/0.1.3/index`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        const file = data.files['/CHANGELOG.md'] || []

        const contentResponse = await fetch(
          `https://www.npmjs.com/package/${
            scope ? `${scope}/${packageName}` : `${packageName}`
          }/file/${file.hex}`
        )
        if (!contentResponse.ok) {
          throw new Error('Network response was not ok')
        }
        const data2 = await contentResponse.text()

        console.log(data2)
        setContent(data2)
        // setFile(file)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchChangelog()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const isDarkMode = false
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Page>
        <Container>
          <HeaderContainer>
            <TitleContainer>
              <LogoImg alt="Backstage logo" title="Backstage logo" src={logo} />

              <TitleHeader>
                Backstage Upgrade Helper - Changelogs Viewer
              </TitleHeader>
            </TitleContainer>
          </HeaderContainer>

          {/* <VersionSelector
            key={defaultPackageName}
            showDiff={handleShowDiff}
            // fromVersion={fromVersion}
            // toVersion={toVersion}
            packageName={defaultPackageName}
            language={defaultLanguage}
            isPackageNameDefinedInURL={isPackageNameDefinedInURL}
          /> */}
        </Container>
        <MarkdownComponent children={content ?? ''} />
      </Page>
    </ThemeProvider>
  )
}

export default Changelogs
