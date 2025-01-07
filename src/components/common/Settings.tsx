import React, { useState } from 'react'
import { Popover, Button, Checkbox, CheckboxChangeEvent } from 'antd'
import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from '../../utils'
import styled from '@emotion/styled'
import { useSettings } from '../../SettingsProvider'

const SettingsButton = styled(Button)`
  color: initial;
`

const SettingsIcon = styled((props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props}>⚙️</span>
))`
  font-family: initial;
`
const Settings = () => {
  const { settings, setSettings } = useSettings()
  const [popoverVisibility, setVisibility] = useState<boolean>(false)

  const handleClickChange = (visibility: boolean) => {
    setVisibility(visibility)
  }

  const toggleShowLatestRCs = (e: CheckboxChangeEvent) =>
    setSettings({
      ...settings,
      [SHOW_LATEST_RCS]: e.target.checked,
    })

  const toggleUseYarnPlugin = (e: CheckboxChangeEvent) => {
    setSettings({
      ...settings,
      [USE_YARN_PLUGIN]: e.target.checked,
    })
  }

  return (
    <Popover
      placement="bottomRight"
      content={
        <>
          <div>
            <Checkbox
              checked={settings[SHOW_LATEST_RCS]}
              onChange={toggleShowLatestRCs}
            >
              {SHOW_LATEST_RCS}
            </Checkbox>
          </div>
          <div>
            <Checkbox
              checked={settings[USE_YARN_PLUGIN]}
              onChange={toggleUseYarnPlugin}
            >
              {USE_YARN_PLUGIN}
            </Checkbox>
          </div>
        </>
      }
      trigger="click"
      open={popoverVisibility}
      onOpenChange={handleClickChange}
    >
      <SettingsButton icon={<SettingsIcon />} />
    </Popover>
  )
}

export default Settings
