import { memo, useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import './AddressSelect.less'
import Tooltip from '@/components/pop/Tooltip'
import Icon from '@/components/Icon'
import ModalComplexSelect from '@/components/pop/ModalComplexSelect'

interface AddressSelectProps {
  className?: string
  value?: AddressList
  onChange?: (value: AddressList) => void
  placeholder?: string
  selectMode?: 'multiple' | 'single'
}

const AddressSelect: FC<AddressSelectProps> = ({
  className,
  value,
  onChange,
  placeholder = '选择部门和成员',
  selectMode
}) => {
  const [visible, setVisible] = useState(false)
  const handleClose = useCallback(
    () => {
      setVisible(false)
    },
    []
  )
  const cName = useMemo(
    () => classnames('com-form-address-select', className),
    [className]
  )
  const handleChoose = useCallback(() => {
    setVisible(true)
  }, [])
  const handleClear = useCallback(
    e => {
      e.stopPropagation()
      if (onChange) {
        onChange({ departments: [], users: [] })
      }
    },
    [onChange]
  )
  const txt = useMemo(
    () => {
      const { departments = [], users = [] } = value || {}
      const v = [
        ...departments, ...users
      ]
      if (v.length > 0) {
        return v.map(({ name }) => name).join('，')
      }
      return ''
    },
    [value]
  )
  const handleChange = useCallback(
    v => {
      if (onChange) {
        onChange(v)
      }
    },
    [onChange]
  )
  return <>
    <div className={cName} onClick={handleChoose}>
      {
        txt
          ? <>
            <Tooltip title={txt}>
              <p className='com-form-address-select--text'>
                { txt }
              </p>
            </Tooltip>
            <Icon
              className='com-form-address-select--icon'
              type='icon-qingkong_mian'
              onClick={handleClear}
            />
          </>
          : <span className='com-form-address-select--placeholder'>
              { placeholder }
            </span>
      }
    </div>
    <ModalComplexSelect
      visible={visible}
      type='complex'
      value={value}
      onChange={handleChange}
      onCancel={handleClose}
      selectMode={selectMode}
    />
  </>
}

export default memo(AddressSelect)
