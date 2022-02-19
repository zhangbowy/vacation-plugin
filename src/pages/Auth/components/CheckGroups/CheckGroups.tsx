import { memo } from 'react'
import type { FC } from 'react'
import Checkbox, { Group } from '@/components/form/Checkbox'
import './CheckGroups.less'

interface CheckGroupsProps {
  value?: any
  onChange?: () => void
}

const CheckGroups: FC<CheckGroupsProps> = ({ value, onChange }) => {
  console.log(value, onChange)
  return <div className='com-auth--check-groups'>
    <Checkbox className='com-auth--check-groups--all'>全选</Checkbox>
    <div className='com-auth--check-groups--content'>
      <Checkbox className='com-auth--check-groups--header'>
        <span className='com-auth--check-groups--header-text'>假期规则</span>
      </Checkbox>
      <Group
        className='com-auth--check-groups--list'
        options={
          [
            {
              label: '查询假期规则查询假期规则查询假期规则', value: 'aa'
            }, {
              label: '新增假期规则', value: 'bb'
            }, {
              label: '查询假期规则', value: 'cc'
            }, {
              label: '新增假期规则', value: 'dd'
            }, {
              label: '查询假期规则', value: 'ee'
            }, {
              label: '新增假期规则', value: 'ff'
            }
          ]
        }
      />
      <Checkbox className='com-auth--check-groups--header'>
        <span className='com-auth--check-groups--header-text'>假期规则</span>
      </Checkbox>
      <Group
        className='com-auth--check-groups--list'
        options={
          [
            {
              label: '查询假期规则查询假期规则查询假期规则', value: 'aa'
            }, {
              label: '新增假期规则', value: 'bb'
            }, {
              label: '查询假期规则', value: 'cc'
            }, {
              label: '新增假期规则', value: 'dd'
            }, {
              label: '查询假期规则', value: 'ee'
            }, {
              label: '新增假期规则', value: 'ff'
            }
          ]
        }
      />
    </div>
  </div>
}

export default memo(CheckGroups)
