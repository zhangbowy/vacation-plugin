import { memo, useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import './DeptSelect.less'
import Tooltip from '@/components/pop/Tooltip'
import Icon from '@/components/Icon'
import ModalComplexSelect from '@/components/pop/ModalComplexSelect'

interface DeptSelectProps {
  className?: string
  value?: AddressDepts
  onChange?: (departments: AddressDepts) => void
  placeholder?: string
  selectMode?: 'multiple' | 'single'
}

const DeptSelect: FC<DeptSelectProps> = ({
  className,
  value,
  onChange,
  placeholder = '选择部门',
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
    () => classnames('com-form-dept-select', className),
    [className]
  )
  const handleChoose = useCallback(() => {
    setVisible(true)
  }, [])
  const handleClear = useCallback(
    e => {
      e.stopPropagation()
      if (onChange) {
        onChange([])
      }
    },
    [onChange]
  )
  const txt = useMemo(
    () => {
      if (value && value.length > 0) {
        return value.map(({ name }) => name).join('，')
      }
      return ''
    },
    [value]
  )
  const modalValue = useMemo(
    () => {
      return {
        departments: value,
        users: []
      }
    },
    [value]
  )
  const handleChange = useCallback(
    ({ departments }) => {
      if (onChange) {
        onChange(departments)
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
              <p className='com-form-dept-select--text'>
                { txt }
              </p>
            </Tooltip>
            <Icon
              className='com-form-dept-select--icon'
              type='icon-qingkong_mian'
              onClick={handleClear}
            />
          </>
          : <span className='com-form-dept-select--placeholder'>
              { placeholder }
            </span>
      }
    </div>
    <ModalComplexSelect
      visible={visible}
      type='dept'
      value={modalValue}
      onChange={handleChange}
      onCancel={handleClose}
      selectMode={selectMode}
    />
  </>
}

export default memo(DeptSelect)
