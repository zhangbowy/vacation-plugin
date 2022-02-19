import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Radio as AntdRadio } from 'antd'
import type { RadioProps } from 'antd'

const Radio: FC<RadioProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-radio', className),
    [className]
  )
  return <AntdRadio className={cName} {...rest} />
}

export default memo(Radio)
