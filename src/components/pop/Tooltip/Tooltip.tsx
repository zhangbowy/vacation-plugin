import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Tooltip as AntdTooltip } from 'antd'
import type { TooltipProps } from 'antd'

const Tooltip: FC<TooltipProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-input', className),
    [className]
  )
  return <AntdTooltip className={cName} {...rest} />
}

export default memo(Tooltip)
