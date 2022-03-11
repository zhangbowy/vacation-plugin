import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Calendar as AntdCalendar } from 'antd'
import type { CalendarProps } from 'antd'
import type { Moment } from 'moment'

const Calendar: FC<CalendarProps<Moment>> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-structure-calendar', className),
    [className]
  )
  return <AntdCalendar className={cName} {...rest} />
}

export default memo(Calendar)
