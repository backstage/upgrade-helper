import React from 'react'
import styled from '@emotion/styled'
import { Select as AntdSelect } from 'antd'

const { Option } = AntdSelect

const SelectBoxContainer = styled.div`
  width: 100%;
`
const SelectBox = styled(AntdSelect)`
  width: 100%;
`

const Select = ({ title, options, ...props }) => (
  <SelectBoxContainer>
    <h4>{title}</h4>

    <SelectBox size="large" {...props}>
      {options.map(({ version, release }) => (
        <Option key={version} value={version}>
          {release ? `${release} (${version})` : version}
        </Option>
      ))}
    </SelectBox>
  </SelectBoxContainer>
)

export default Select
