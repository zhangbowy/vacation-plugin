import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { DatePicker } from 'antd'
import type { RangePickerProps } from 'antd/lib/date-picker'
import Icon from '@/components/Icon'

const { RangePicker: AntdRangePicker } = DatePicker

const RangePicker: FC<RangePickerProps> = ({
  className,
  suffixIcon = <Icon type='icon-Calendar1' />,
  separator = <Icon type='icon-riqizhouqi' />,
  ...rest
}) => {
  const cName = useMemo(
    () => classnames('com-form-range-picker', className),
    [className]
  )
  return <AntdRangePicker
    className={cName}
    suffixIcon={suffixIcon}
    separator={separator}
    {...rest}
  />
}

export default memo(RangePicker)
