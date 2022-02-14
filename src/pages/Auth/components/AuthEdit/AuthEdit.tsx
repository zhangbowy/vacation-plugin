import { memo, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import { Drawer, Form, Input } from 'antd'
import Icon from '@/components/Icon'
import UserSelect from '@/components/form/UserSelect'
import Button from '@/components/buttons/Button'
import CheckGroups from '../CheckGroups'
import RangeSelect from '../RangeSelect'
import './AuthEdit.less'

const { Item } = Form

const AuthEdit: FC<{
  id: string
  visible: boolean
  onVisibleChange: ({ id, visible }: { id: string, visible: boolean }) => void
}> = ({ id, visible, onVisibleChange }) => {
  const handleVisibleChange = useCallback(
    () => onVisibleChange({
      visible: false, id: ''
    }),
    [onVisibleChange]
  )
  const showCount = useMemo(
    () => ({
      formatter: (
        { count, maxLength }:
        { count: number, maxLength?: number }
      ) => 
        <p>
          <span>{ count }</span>
          <span>{ `/${maxLength}` }</span>
        </p>
    }),
    []
  )
  const handleConfirm = useCallback(
    () => {
      console.log('id', id)
    },
    [id]
  )
  const footer = useMemo(
    () => <div>
      <Button onClick={handleVisibleChange}>取消</Button>
      <Button type='primary' onClick={handleConfirm}>保存</Button>
    </div>,
    [handleVisibleChange, handleConfirm]
  )
  return (
    <Drawer
      className='pg-auth--edit'
      visible={visible}
      onClose={handleVisibleChange}
      title='新增权限'
      width={600}
      closeIcon={<Icon type='icon-guanbi' />}
      footer={footer}
    >
      <Form layout='vertical'>
        <Item
          label='规则名称'
          name='company'
          rules={[{ required: true, message: '请输入规则名称' }]}
        >
          <Input
            placeholder='请输入'
            showCount={showCount}
            maxLength={30}
          />
        </Item>
        <Item
          label='成员'
          name='unusedMode'
          rules={[{ required: true, message: '请选择成员' }]}
        >
          <UserSelect placeholder='请选择' />
        </Item>
        <Item label='管理范围' name='kkk'>
          <RangeSelect />
        </Item>
        <Item label='分配权限'>
          <CheckGroups />
        </Item>
      </Form>
    </Drawer>
  )
}

export default memo(AuthEdit)
