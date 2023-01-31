import React, { useState } from 'react'
import { Popover, Button, Checkbox } from 'antd'
import { SHOW_LATEST_RCS } from '../../utils'
import styled from '@emotion/styled'

const SettingsButton = styled(Button)`
  color: initial;
`

const SettingsIcon = styled(props => <span {...props}>⚙️</span>)`
  font-family: initial;
`
const Settings = ({ handleSettingsChange, settings }) => {
  const [popoverVisibility, setVisibility] = useState(false)

  const handleClickChange = visibility => {
    setVisibility(visibility)
  }

  const updateCheckboxValues = () =>
    handleSettingsChange({
      [SHOW_LATEST_RCS]: !settings[SHOW_LATEST_RCS]
    })

  return (
    <Popover
      placement="bottomRight"
      content={
        <>
          <Checkbox
            defaultChecked={settings[SHOW_LATEST_RCS]}
            onChange={updateCheckboxValues}
          >
            {SHOW_LATEST_RCS}
          </Checkbox>
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
