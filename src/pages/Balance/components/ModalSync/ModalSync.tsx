import { memo, useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import './ModalSync.less'
import CommonModal from '@/components/pop/CommonModal'
import Icon from '@/components/Icon'
import { Group } from '@/components/form/Checkbox'
import { balanceSync } from '@/services/balance'
import loading from '@/components/pop/loading'
import { msg, errMsg } from '@/components/pop'

interface ModalSyncProps {
  visible: boolean
  onCancel: VoidFunction
  syncOptions: string[]
}

const ModalSync: FC<ModalSyncProps> = ({ visible, onCancel, syncOptions }) => {
  const [value, setValue] = useState<any[]>([])
  const handleChange = (d: any[]) => {
    setValue(d)
  }
  const handleConfirm = useCallback(
    () => {
      if (!value || !value.length) {
        errMsg('请选择需要同步的假期')
        return
      }
      loading.show()
      balanceSync({ name: value }).then(d => {
        loading.hide()
        if (d[0]) {
          msg('操作成功')
          onCancel()
        }
      })
    },
    [value, onCancel]
  )
  useEffect(
    () => {
      if (visible) {
        setValue([])
      }
    },
    [visible]
  )
  return <CommonModal
    className='pg-balance--modal-sync'
    title='同步历史余额'
    visible={visible}
    onOk={handleConfirm}
    onCancel={onCancel}
    width={432}
    okText='同步'
  >
    <p className='pg-balance--modal-sync--tip'>
      <Icon className='pg-balance--modal-sync--tip-icon' type='icon-tishi' />
      <span className='pg-balance--modal-sync--tip-text'>
        假期名字一致才可同步，同步成功的假期不可再次同步。
      </span>
    </p>
    <p className='pg-balance--modal-sync--text font-bold'>选择需要同步的假期</p>
    <Group
      className='pg-balance--modal-sync--checkbox-group'
      value={value}
      options={syncOptions}
      onChange={handleChange}
    />
  </CommonModal>
}

export default memo(ModalSync)
