import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Select as AntdSelect } from 'antd'
import type { SelectProps } from 'antd'

const Select: FC<SelectProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-select', className),
    [className]
  )
  return <AntdSelect className={cName} {...rest} />
}

export default memo(Select)
