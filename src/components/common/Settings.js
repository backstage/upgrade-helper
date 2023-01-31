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
const Settings = ({ handleSettingsChange }) => {
  const [popoverVisibility, setVisibility] = useState(false)

  const handleClickChange = visibility => {
    setVisibility(visibility)
  }

  const updateCheckboxValues = checkboxValues =>
    handleSettingsChange(checkboxValues)

  return (
    <Popover
      placement="bottomRight"
      content={
        <>
          <Checkbox.Group onChange={updateCheckboxValues}>
            <div>
              <Checkbox value={SHOW_LATEST_RCS}>{SHOW_LATEST_RCS}</Checkbox>
            </div>
          </Checkbox.Group>
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
