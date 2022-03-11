import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { InputNumber as AntdInputNumber } from 'antd'
import type { InputNumberProps } from 'antd'
import './InputNumber.less'

const InputNumber: FC<InputNumberProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-input-number', className),
    [className]
  )
  return <AntdInputNumber className={cName} {...rest} />
}

export default memo(InputNumber)
