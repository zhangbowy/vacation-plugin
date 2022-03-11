import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Checkbox as AntdCheckbox } from 'antd'
import type { CheckboxProps } from 'antd'

const Checkbox: FC<CheckboxProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-checkbox', className),
    [className]
  )
  return <AntdCheckbox className={cName} {...rest} />
}

export default memo(Checkbox)
