import { memo, useState, useCallback, useRef, useEffect } from 'react'
import type { FC } from 'react'
import './Survey.less'
import Calendar from '@/components/structure/Calendar'
import moment from 'moment'
import type { Moment } from 'moment'
import { getLeaveSurvey } from '@/services/leave'
import DeptSelect from '@/components/form/DeptSelect'
import type { ValuesType } from '@/components/form/DeptSelect'
import loading from '@/components/pop/loading'
import SurveyOptions from '../SurveyOptions'

interface SurveyProps {
  changeSelecteDate: (x: Moment) => void
}

const Survey: FC<SurveyProps> = ({ changeSelecteDate }) => {
  const refCurrent = useRef(moment())
  const refCurrentStr = useRef(refCurrent.current.format('YYYYMMDD'))
  const [value, setValue] = useState<Moment>(refCurrent.current)
  const [depts, onChangeDepts] = useState<ValuesType>([])
  const [info, setInfo] = useState<Record<string, number>>({})
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
      const [fmt, str, month] = date.format('YYYYMMDD//YYYY-MM-DD//M').split('//')
      const isToday = fmt === refCurrentStr.current
      const selectMonth = value.format('M')
      return <div
        className={
          month === selectMonth
            ? 'pg-overview--survey--cell'
            : 'pg-overview--survey--cell not-current'
        }
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <p className='pg-overview--survey--cell-date'>{ date.date() }</p>
        {
          info[str] &&
          <div
            className='pg-overview--survey--cell-body'
            onClick={() => {
              changeSelecteDate(date)
            }}
          >
            <span className='pg-overview--survey--cell-body-title'>休假</span>
            <span className='pg-overview--survey--cell-body-content'>
              { `${info[str]}人` }
            </span>
          </div>
        }
        {
          isToday && <p className='pg-overview--survey--cell-today'>今</p>
        }
      </div>
    },
    [value, changeSelecteDate, info]
  )
  useEffect(
    () => {
      const params: Record<string, any> = {
        year: value.year(),
        month: value.month() + 1
      }
      if (depts && depts[0]) {
        params.deptId = depts[0].id
      }
      if (value && value.isValid()) {
        loading.show()
        getLeaveSurvey(params).then(d => {
          loading.hide()
          if (d[0]) {
            setInfo(d[1] || {})
          }
        })
      }
    },
    [value, depts]
  )
  return <>
    <DeptSelect
      placeholder='选择部门'
      value={depts}
      onChange={onChangeDepts}
      options={{ multiple: false }}
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
