import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { DatePicker } from 'antd'
import type { RangePickerProps } from 'antd/lib/date-picker'

const { RangePicker: AntdRangePicker } = DatePicker

const RangePicker: FC<RangePickerProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-range-picker', className),
    [className]
  )
  return <AntdRangePicker className={cName} {...rest} />
}

export default memo(RangePicker)
