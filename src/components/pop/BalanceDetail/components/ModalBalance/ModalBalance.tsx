import { memo, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import './ModalBalance.less'
import CommonModal from '@/components/pop/CommonModal'
import Form, { Item } from '@/components/form/Form'
import Select from '@/components/form/Select'
import InputNumber from '@/components/form/InputNumber'

const selOptions = [
  { label: '增加' , value: 'add' },
  { label: '减少' , value: 'sub' }
]

interface ItemInfoProps {
  value?: { status?: string, number?: number },
  onChange?: (x: { status?: string, number?: number }) => void
}

const ItemInfo: FC<ItemInfoProps> = memo(({ value, onChange }) => {
  const { status = 'add', number } = useMemo(
    () => value || { status: 'add', number: undefined },
    [value]
  )
  const handleSelect = useCallback(
    newStatus => {
      if (onChange) {
        onChange({ status: newStatus, number })
      }
    },
    [number, onChange]
  )
  const handleInput = useCallback(
    newNumber => {
      if (onChange) {
        onChange({ status, number: newNumber })
      }
    },
    [status, onChange]
  )
  return <div className='com-pop-balance-detail--modal-balance--item'>
    <Select
      className='com-pop-balance-detail--modal-balance--select'
      value={status}
      onChange={handleSelect}
      options={selOptions}
    />
    <InputNumber
      className='com-pop-balance-detail--modal-balance--input'
      value={number}
      onChange={handleInput}
    />
    <p className='com-pop-balance-detail--modal-balance--unit'>小时</p>
  </div>
})

interface ModalBalanceProps {
  visible: boolean
  onCancel: VoidFunction
}

const ModalBalance: FC<ModalBalanceProps> = ({ visible, onCancel }) => {
  const handleConfirm = () => {
    console.log('save')
  }
  return <CommonModal
    className='com-pop-balance-detail--modal-balance'
    title='修改余额'
    visible={visible}
    onOk={handleConfirm}
    onCancel={onCancel}
    okText='保存'
  >
    <div className='com-pop-balance-detail--modal-balance--texts'>
      <p className='com-pop-balance-detail--modal-balance--topic'>
        当前调休假余额：
      </p>
      <p className='com-pop-balance-detail--modal-balance--number'>
        10.54小时
      </p>
    </div>
    <Form layout='vertical'>
      <Item
        className='com-pop-balance-detail--modal-balance--item-wrap'
        label='修改余额'
        name='rest'
        rules={[{ required: true, message: '请输入余额' }]}
      >
        <ItemInfo />
      </Item>
    </Form>
  </CommonModal>
}

export default memo(ModalBalance)
