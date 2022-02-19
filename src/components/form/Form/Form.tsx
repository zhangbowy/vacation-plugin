import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Form as AntdForm } from 'antd'
import type { FormProps } from 'antd'
import './Form.less'

const Form: FC<FormProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form', className),
    [className]
  )
  return <AntdForm className={cName} {...rest} />
}

export default memo(Form)
