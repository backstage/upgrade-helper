import React, { useState } from 'react'
import { Popover, Button, Checkbox } from 'antd'
import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from '../../utils'
import styled from '@emotion/styled'
import { useSettings } from '../../SettingsProvider'

const SettingsButton = styled(Button)`
  color: initial;
`

const SettingsIcon = styled(props => <span {...props}>⚙️</span>)`
  font-family: initial;
`
const Settings = () => {
  const { settings, setSettings } = useSettings()
  const [popoverVisibility, setVisibility] = useState(false)

  const handleClickChange = visibility => {
    setVisibility(visibility)
  }

  const toggleShowLatestRCs = () =>
    setSettings({
      ...settings,
      [SHOW_LATEST_RCS]: !settings[SHOW_LATEST_RCS]
    })

  const toggleUseYarnPlugin = () =>
    setSettings({
      ...settings,
      [USE_YARN_PLUGIN]: !settings[USE_YARN_PLUGIN]
    })

  return (
    <Popover
      placement="bottomRight"
      content={
        <>
          <div>
            <Checkbox
              defaultChecked={settings[SHOW_LATEST_RCS]}
              onChange={toggleShowLatestRCs}
            >
              {SHOW_LATEST_RCS}
            </Checkbox>
          </div>
          <div>
            <Checkbox
              defaultChecked={settings[USE_YARN_PLUGIN]}
              onChange={toggleUseYarnPlugin}
            >
              {USE_YARN_PLUGIN}
            </Checkbox>
          </div>
        </>
      }
      trigger="click"
      visible={popoverVisibility}
      onVisibleChange={handleClickChange}
    >
      <SettingsButton icon={<SettingsIcon />} />
    </Popover>
  )
}

export default Settings
