import React, { useState } from 'react'
import { Popover, Button, Checkbox, CheckboxChangeEvent } from 'antd'
import { SHOW_LATEST_RCS, USE_YARN_PLUGIN } from '../../utils'
import styled from '@emotion/styled'
// import { WindowsFilled } from '@ant-design/icons'
// import { PACKAGE_NAMES, LANGUAGE_NAMES } from '../../constants'
// import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { useSettings } from '../../SettingsProvider'

const SettingsButton = styled(Button)`
  color: initial;
`

const SettingsIcon = styled((props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props}>⚙️</span>
))`
  font-family: initial;
`

// const PlatformsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: start;
//   margin-top: 12px;
// `

// const PackagesGroupContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: start;
// `

const Settings = ({
  handleSettingsChange,
}: {
  handleSettingsChange?: (checkboxValues: string[]) => void
  packageName?: string
  language?: string
  onChangePackageNameAndLanguage?: (params: {
    newPackageName?: string
    newLanguage: string
  }) => void
}) => {
  const { settings, setSettings } = useSettings()
  const [popoverVisibility, setVisibility] = useState<boolean>(false)
  // const [newPackageName, setNewPackageName] = useState(packageName)
  // const [newLanguage, setNewLanguage] = useState(language)

  const handleClickChange = (visibility: boolean) => {
    setVisibility(visibility)

    // const processedNewLanguage =
    //   newLanguage !== language && newPackageName === PACKAGE_NAMES.RNW
    //     ? newLanguage
    //     : LANGUAGE_NAMES.CPP

    // if (
    //   !visibility &&
    //   (newPackageName !== packageName || processedNewLanguage !== language)
    // ) {
    //   onChangePackageNameAndLanguage({
    //     newPackageName:
    //       newPackageName !== packageName ? newPackageName : undefined,
    //     newLanguage: processedNewLanguage,
    //   })
    // }
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

  // const updateCheckboxValues = (checkboxValues: CheckboxValueType[]) =>
  //   handleSettingsChange?.(checkboxValues)

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
          {/* <PlatformsContainer>
            <h5>Upgrading another platform?</h5>
            <Radio.Group
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
            >
              <PackagesGroupContainer>
                <Radio value={PACKAGE_NAMES.RN}>react-native</Radio>
                <Radio value={PACKAGE_NAMES.RNW}>
                  <Radio.Group
                    size="small"
                    value={
                      newPackageName === PACKAGE_NAMES.RNW
                        ? newLanguage
                        : undefined
                    }
                    onChange={(e) => {
                      setNewPackageName(PACKAGE_NAMES.RNW)
                      setNewLanguage(e.target.value)
                    }}
                  >
                    <Typography.Text style={{ marginRight: 10 }}>
                      react-native-windows
                      <WindowsFilled style={{ margin: 5 }} />
                    </Typography.Text>
                    <Radio.Button value="cpp">C++</Radio.Button>
                    <Radio.Button value="cs">C#</Radio.Button>
                  </Radio.Group>
                </Radio>
                <Radio value={PACKAGE_NAMES.RNM}>react-native-macos</Radio>
              </PackagesGroupContainer>
            </Radio.Group>
          </PlatformsContainer> */}
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
