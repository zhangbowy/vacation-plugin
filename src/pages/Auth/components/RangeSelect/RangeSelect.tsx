import { memo } from 'react'
import type { FC } from 'react'
import { Radio } from 'antd'
import './RangeSelect.less'

const { Group } = Radio

interface RangeSelectProps {
  value?: any
  onChange?: () => void
}

const RangeSelect: FC<RangeSelectProps> = ({ value, onChange }) => {
  console.log(value, onChange)
  return <div className='com-auth--range-select'>
    <Group>
      <Radio value={'a'}>全公司</Radio>
      <Radio value={'b'}>所在部门及其下属部门</Radio>
      <Radio value={'c'}>
        <span>指定部门</span>
        <a>选择部门</a>
      </Radio>
    </Group>
  </div>
}

export default memo(RangeSelect)
