import { memo, useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import './UserSelect.less'
import Icon from '@/components/Icon'
import Tooltip from '@/components/pop/Tooltip'
import ModalComplexSelect from '@/components/pop/ModalComplexSelect'

interface UserSelectProps {
  className?: string
  value?: AddressUsers
  onChange?: (value: AddressUsers) => void
  placeholder?: string
}

const UserSelect: FC<UserSelectProps> = ({
  className,
  value,
  onChange,
  placeholder = '选择成员'
}) => {
  const [visible, setVisible] = useState(false)
  const handleClose = useCallback(
    () => {
      setVisible(false)
    },
    []
  )
  const cName = useMemo(
    () => classnames('com-form-user-select', className),
    [className]
  )
  const handleChoose = useCallback(() => {
    setVisible(true)
  }, [])
  const handleClear = useCallback(
    (e) => {
      e.stopPropagation()
      if (onChange) {
        onChange([])
      }
    },
    [onChange],
  )
  const txt = useMemo(
    () => {
      if (value && value.length > 0) {
        return value.map(({ name }: { name: string }) => name).join('，')
      }
      return ''
    },
    [value]
  )
  console.log('visible', visible)
  const modalValue = useMemo(
    () => {
      return {
        departments: [],
        users: value
      }
    },
    [value]
  )
  const handleChange = useCallback(
    ({ users }) => {
      if (onChange) {
        onChange(users)
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
              <p className="com-form-user-select--text">{txt}</p>
            </Tooltip>
            <Icon
              className="com-form-user-select--icon"
              type="icon-qingkong_mian"
              onClick={handleClear}
            />
          </>
          : <span className="com-form-user-select--placeholder">
            { placeholder }
          </span>
      }
    </div>
    <ModalComplexSelect
      visible={visible}
      type='user'
      value={modalValue}
      onChange={handleChange}
      onCancel={handleClose}
    />
  </>
}

export default memo(UserSelect)
