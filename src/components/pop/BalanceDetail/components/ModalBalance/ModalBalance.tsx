import { memo, useMemo, useCallback, useEffect } from 'react'
import type { FC } from 'react'
import './ModalBalance.less'
import CommonModal from '@/components/pop/CommonModal'
import Form, { Item, useForm } from '@/components/form/Form'
import { msg, errMsg } from '@/components/pop'
import Select from '@/components/form/Select'
import InputNumber from '@/components/form/InputNumber'
import { updateBalance } from '@/services/balance'
import loading from '@/components/pop/loading'

const selOptions = [
  { label: '增加' , value: 'add' },
  { label: '减少' , value: 'sub' }
]

interface ItemInfoProps {
  value?: { status?: string, number?: number }
  onChange?: (x: { status?: string, number?: number }) => void
  data: { durationType?: 0 | 2, duration?: number }
}

const ItemInfo: FC<ItemInfoProps> = memo(({ value, onChange, data }) => {
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
      min={0}
      precision={2}
    />
    <p className='com-pop-balance-detail--modal-balance--unit'>
      {
        `${
          data.durationType === 0 ? '天' : '小时'
        }`
      }
    </p>
  </div>
})

interface ModalBalanceProps {
  visible: boolean
  onCancel: VoidFunction
  onConfirm: VoidFunction
  data: { durationType?: 0 | 2, duration?: number }
  ruleId: string
  item: any
}

const ModalBalance: FC<ModalBalanceProps> = ({
  visible, onCancel, onConfirm, ruleId, data, item
}) => {
  const [form] = useForm()
  const handleConfirm = useCallback(
    () => {
      loading.show()
      form.validateFields().then(
        values => {
          const { status, number } = values.rest
          if (!number) {
            errMsg('请输入余额')
            loading.hide()
          } else {
            updateBalance({
              balanceEditType: status === 'add' ? 1 : 2,
              editValue: number * 100,
              ruleId,
              userId: item.userId
            }).then(d => {
              loading.hide()
              if (d && d[0]) {
                msg('操作成功')
                onConfirm()
              }
            })
          }
        }
      ).catch(e => {
        loading.hide()
        const { errorFields = [] } = e;
        if (errorFields[0] && errorFields[0].errors) {
          const errors = errorFields[0].errors || []
          errMsg(errors[0] || '参数错误，请检查')
        } else {
          errMsg(e)
        }
      })
    },
    [form, ruleId, item, onConfirm]
  )
  useEffect(
    () => {
      if (visible) {
        form.resetFields()
      }
    },
    [visible, form]
  )
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
        当前假期余额：
      </p>
      <p className='com-pop-balance-detail--modal-balance--number'>
        {
          `${
            (data.duration || 0) / 100
          }${
            data.durationType === 0 ? '天' : '小时'
          }`
        }
      </p>
    </div>
    <Form layout='vertical' form={form}>
      <Item
        className='com-pop-balance-detail--modal-balance--item-wrap'
        label='修改余额'
        name='rest'
        rules={[{ required: true, message: '请输入余额' }]}
      >
        <ItemInfo data={data} />
      </Item>
    </Form>
  </CommonModal>
}

export default memo(ModalBalance)
