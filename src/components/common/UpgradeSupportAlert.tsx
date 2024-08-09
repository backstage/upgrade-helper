import React from 'react'
import styled from '@emotion/styled'
import { Tooltip } from 'antd'
import type { Theme } from '../../theme'

interface UpgradeSupportAlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  theme?: Theme
}
const UpgradeSupportAlert = styled((props: UpgradeSupportAlertProps) => (
  <div {...props}>
    <span>
      Check out{' '}
      <Tooltip
        placement="bottom"
        title="Backstage's Support is a community-backed place to request and give help."
      >
        <a
          href="https://backstage.io/docs/overview/support"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support and community
        </a>
      </Tooltip>{' '}
      if you are experiencing issues related to Backstage during the upgrading
      process.
    </span>
  </div>
))`
  span > a {
    color: ${({ theme }) => theme.link}};
  }
`

export default UpgradeSupportAlert
