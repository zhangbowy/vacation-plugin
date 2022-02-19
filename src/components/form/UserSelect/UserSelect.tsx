import { memo, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import './UserSelect.less'
import Icon from '@/components/Icon'
import Tooltip from '@/components/pop/Tooltip'
import { chooseComplexPicker } from '@xfw/rc-dingtalk-jsapi'

export type ValuesType = {
  emplId: string | number, name: string, avatar: number
}[]

interface UserSelectProps {
  className?: string
  value?: ValuesType
  onChange?: (
    users: ValuesType
  ) => any
  options?: Record<string, any>,
  placeholder?: string
}

const UserSelect: FC<UserSelectProps> = ({
  className, value, onChange, options = {}, placeholder = '选择成员'
}) => {
  const cName = useMemo(
    () => classnames('com-form-user-select', className),
    [className]
  )
  console.log('onChange', onChange)
  const handleChoose = useCallback(
    () => {
      console.log((value || []).map(({ emplId }) => emplId))
      chooseComplexPicker({
        title: '选择部门',
        pickedUsers: value
          ? value.map(({ emplId }) => emplId)
          : [],
        responseUserOnly: true,
        ...options
        // @ts-ignore
      }).then(({ users }) => {
        if (onChange) {
          onChange(users)
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
            <p className='com-form-user-select--text'>
              { txt }
            </p>
          </Tooltip>
          <Icon
            className='com-form-user-select--icon'
            type='icon-Close-Circle-Fill'
            onClick={handleClear}
          />
        </>
        : <span className='com-form-user-select--placeholder'>
            { placeholder }
          </span>
    }
  </div>
}

export default memo(UserSelect)
