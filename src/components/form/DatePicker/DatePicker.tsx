import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { DatePicker as AntdDatePicker } from 'antd'
import type { DatePickerProps } from 'antd'
import Icon from '@/components/Icon'

const DatePicker: FC<DatePickerProps> = ({
  className,
  suffixIcon = <Icon type='icon-Calendar1' />,
  ...rest
}) => {
  const cName = useMemo(
    () => classnames('com-form-date-picker', className),
    [className]
  )
  return <AntdDatePicker className={cName} suffixIcon={suffixIcon} {...rest} />
}

export default memo(DatePicker)
