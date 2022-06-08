import React from 'react'
import styled from '@emotion/styled'
import { Button as AntdButton } from 'antd'
import { getDiffURL } from '../../utils'

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: auto;
  overflow: hidden;
  margin-top: 25px;
`

const Button = styled(AntdButton)`
  border-radius: 3px;
`

const RawDiffLinkButton = ({
  packageName,
  language,
  fromVersion,
  toVersion
}) => {
  if (fromVersion === '') {
    return null
  }
  const diffURL = getDiffURL({
    packageName,
    language,
    fromVersion,
    toVersion
  })
  return (
    <Container>
      <Button href={diffURL} type="link" size="large">
        See raw text diff
      </Button>
    </Container>
  )
}

export default RawDiffLinkButton
