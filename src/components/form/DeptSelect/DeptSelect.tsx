import { memo, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import './DeptSelect.less'
import Tooltip from '@/components/pop/Tooltip'
import Icon from '@/components/Icon'
import { chooseDepartments } from '@xfw/rc-dingtalk-jsapi'

export type ValuesType = { id: string | number, name: string, number: number }[]

interface DeptSelectProps {
  className?: string
  value?: ValuesType
  onChange?: (
    departments: ValuesType
  ) => any
  options?: Record<string, any>,
  placeholder?: string
}

const DeptSelect: FC<DeptSelectProps> = ({
  className, value, onChange, options = {}, placeholder = '选择部门'
}) => {
  const cName = useMemo(
    () => classnames('com-form-dept-select', className),
    [className]
  )
  console.log('onChange', onChange)
  const handleChoose = useCallback(
    () => {
      console.log((value || []).map(({ id }) => id))
      chooseDepartments({
        title: '选择部门',
        departments: value
          ? value.map(({ id }) => id)
          : [],
        ...options
      }).then(({ departments }) => {
        if (onChange) {
          onChange(departments)
        }
      })
    },
    [onChange, options, value]
  )
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
  return <div className={cName} onClick={handleChoose}>
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
            type='icon-Close-Circle-Fill'
            onClick={handleClear}
          />
        </>
        : <span className='com-form-dept-select--placeholder'>
            { placeholder }
          </span>
    }
  </div>
}

export default memo(DeptSelect)
