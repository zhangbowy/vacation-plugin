import { memo } from 'react'
import type { FC } from 'react'
import { Checkbox } from 'antd'
import './CheckGroups.less'

const { Group } = Checkbox

interface CheckGroupsProps {
  value?: any
  onChange?: () => void
}

const CheckGroups: FC<CheckGroupsProps> = ({ value, onChange }) => {
  console.log(value, onChange)
  return <div className='com-auth--check-groups'>
    <Checkbox>全选</Checkbox>
    <div className='range-select'>
      <Checkbox>假期规则</Checkbox>
      <Group
        options={
          [
            {
              label: '查询假期规则', value: 'aa'
            }
          ]
        }
      />
    </div>
  </div>
}

export default memo(CheckGroups)
