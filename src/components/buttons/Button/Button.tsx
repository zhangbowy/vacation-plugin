import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Button as AntdButton } from 'antd'
import type { ButtonProps } from 'antd'

const Button: FC<ButtonProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-buttons-button', className),
    [className]
  )
  return <AntdButton className={cName} {...rest} />
}

export default memo(Button)
