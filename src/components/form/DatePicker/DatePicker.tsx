import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { DatePicker as AntdDatePicker } from 'antd'
import type { DatePickerProps } from 'antd'

const DatePicker: FC<DatePickerProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-date-picker', className),
    [className]
  )
  return <AntdDatePicker className={cName} {...rest} />
}

export default memo(DatePicker)
