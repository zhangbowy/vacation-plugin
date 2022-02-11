import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Input as AntdInput } from 'antd'
import type { InputProps } from 'antd'
import './Input.less'

const Input: FC<InputProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-input', className),
    [className]
  )
  return <AntdInput className={cName} {...rest} />
}

export default memo(Input)
