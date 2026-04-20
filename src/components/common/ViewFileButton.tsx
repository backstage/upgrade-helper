import React from 'react'
import styled from '@emotion/styled'
import { Button, ButtonProps } from 'antd'
import { getBinaryFileURL, USE_YARN_PLUGIN } from '../../utils'
import { useSettings } from '../../SettingsProvider'

interface ViewFileButtonProps extends ButtonProps {
  open: boolean
  version: string
  path: string
  packageName: string
}
const ViewFileButton = styled(
  ({ open, version, path, packageName, ...props }: ViewFileButtonProps) => {
    if (!open) {
      return null
    }

    const {
      settings: { [USE_YARN_PLUGIN]: useYarnPlugin },
    } = useSettings()

    return (
      <Button
        {...props}
        target="_blank"
        size="small"
        href={getBinaryFileURL({ packageName, version, path, useYarnPlugin })}
      >
        Raw
      </Button>
    )
  }
)`
  font-size: 13px;
`

export default ViewFileButton
