import React from 'react'
import styled from '@emotion/styled'
import { Button as AntdButton } from 'antd'
import { getDiffURL } from '../../utils'

const Container = styled.div`
  display: flex;
  justify-content: center;
  top: 10px;
  font-size: 12px;
  border-width: 0px;
  height: 20px;
`

const Button = styled(AntdButton)`
  border-radius: 3px;
  line-height: 30px;
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
      <Button href={diffURL} type="link">
        View raw diff
      </Button>
    </Container>
  )
}

export default RawDiffLinkButton
