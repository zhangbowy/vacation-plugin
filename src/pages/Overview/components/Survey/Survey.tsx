import { memo, useState, useCallback, useRef } from 'react'
import type { FC } from 'react'
import './Survey.less'
import Calendar from '@/components/structure/Calendar'
import moment from 'moment'
import type { Moment } from 'moment'
import SurveyOptions from '../SurveyOptions'

const Survey: FC = () => {
  const refCurrent = useRef(moment())
  const refCurrentStr = useRef(refCurrent.current.format('YYYYMMDD'))
  const [value, setValue] = useState<Moment>(refCurrent.current)
  const headerRender = useCallback(
    ({ value: headerValue, onChange }) => {
      return <SurveyOptions value={headerValue} onChange={onChange} />
    },
    []
  )
  const cellRender = useCallback(
    date => {
      const isToday = date.format('YYYYMMDD') === refCurrentStr.current
      const month = date.format('M')
      const selectMonth = value.format('M')
      return <div
        className={
          month === selectMonth
            ? 'pg-overview--survey--cell'
            : 'pg-overview--survey--cell not-current'
        }
      >
        <p className='pg-overview--survey--cell-date'>{ date.date() }</p>
        <div className='pg-overview--survey--cell-body'>
          <span className='pg-overview--survey--cell-body-title'>休假</span>
          <span className='pg-overview--survey--cell-body-content'>15人</span>
        </div>
        {
          isToday && <p className='pg-overview--survey--cell-today'>今</p>
        }
      </div>
    },
    [value]
  )
  return <Calendar
    className='pg-overview--survey'
    headerRender={headerRender}
    dateFullCellRender={cellRender}
    value={value}
    onChange={setValue}
  />
}

export default memo(Survey)
