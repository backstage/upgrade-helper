import React from 'react'
import { Button, ButtonProps } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { getBinaryFileURL, USE_YARN_PLUGIN } from '../../utils'
import { useSettings } from '../../SettingsProvider'

interface DownloadFileButtonProps extends ButtonProps {
  open: boolean
  version: string
  path: string
  packageName: string
}
const DownloadFileButton = ({
  open,
  version,
  path,
  packageName,
  ...props
}: DownloadFileButtonProps) => {
  const {
    settings: { [USE_YARN_PLUGIN]: useYarnPlugin },
  } = useSettings()

  return open ? (
    <Button
      {...props}
      shape="circle"
      icon={<DownloadOutlined />}
      target="_blank"
      href={getBinaryFileURL({ packageName, version, path, useYarnPlugin })}
    />
  ) : null
}

export default DownloadFileButton
