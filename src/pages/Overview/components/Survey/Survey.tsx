import { memo, useState, useCallback, useRef, useEffect } from 'react'
import type { FC } from 'react'
import './Survey.less'
import Calendar from '@/components/structure/Calendar'
import moment from 'moment'
import type { Moment } from 'moment'
import { getLeaveSurvey } from '@/services/leave'
import DeptSelect from '@/components/form/DeptSelect'
import type { ValuesType } from '@/components/form/DeptSelect'
import SurveyOptions from '../SurveyOptions'

const Survey: FC<{ changeSelecteDate: (x: Moment) => void }> = ({ changeSelecteDate }) => {
  const refCurrent = useRef(moment())
  const refCurrentStr = useRef(refCurrent.current.format('YYYYMMDD'))
  const [value, setValue] = useState<Moment>(refCurrent.current)
  const [depts, onChangeDepts] = useState<ValuesType>([])
  const headerRender = useCallback(
    ({ value: headerValue, onChange }) => {
      return <SurveyOptions
        value={headerValue}
        onChange={onChange}
      />
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
        onClick={e => {
          e.stopPropagation()
          changeSelecteDate(date)
        }}
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
    [value, changeSelecteDate]
  )
  useEffect(
    () => {
      if (value && value.isValid()) {
        getLeaveSurvey({
          year: value.year(),
          month: value.month() + 1
        })
      }
    },
    [value]
  )
  return <>
    <DeptSelect
      placeholder='选择部门'
      value={depts}
      onChange={onChangeDepts}
    />
    <Calendar
      className='pg-overview--survey'
      headerRender={headerRender}
      dateFullCellRender={cellRender}
      value={value}
      onChange={setValue}
    />
  </>
}

export default memo(Survey)
