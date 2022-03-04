import { memo, useMemo } from 'react'
import type { FC } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import type { Moment } from 'moment'
import './CombineDatePicker.less'
import Select from '@/components/form/Select'
import DatePicker from '@/components/form/DatePicker'

const disabledDate = (c: Moment) => c > moment().endOf('day')
const options = [
  { label: '按年', value: 'year' }, { label: '按月', value: 'month' }
]

const CombineDatePicker: FC<{ tableName: string }> = ({ tableName }) => {
  const dispatch = useDispatch()
  const { pickerMode, date, currentTableName } = useSelector(
    (
      state: {
        table: {
          params: { pickerMode?: 'year' | 'month', date: Moment },
          name: string
        }
      }
    ) => ({
      pickerMode: state.table.params.pickerMode || 'year',
      date: state.table.params.date,
      currentTableName: state.table.name
    })
  )
  const { dateValue, pcikerModeValue } = useMemo(
    () => !tableName || currentTableName === tableName
      ? { dateValue: date, pcikerModeValue: pickerMode }
      : { dateValue: undefined, pcikerModeValue: undefined },
    [tableName, currentTableName, date, pickerMode]
  )
  const handleUpdatePickerMode = (newPickerMode: 'year' | 'month') => {
    dispatch({
      type: 'table/updateParams',
      params: { pickerMode: newPickerMode }
    })
  }
  const handleUpdateDate = (newDate: Moment | null) => {
    dispatch({
      type: 'table/updateParams',
      params: { date: newDate }
    })
  }

  return <div className='pg-statistics--combine-date-picker'>
    <Select
      className='pg-statistics--combine-date-picker--select'
      options={options}
      value={pcikerModeValue}
      onChange={handleUpdatePickerMode}
    />
    <DatePicker
      className='pg-statistics--combine-date-picker--picker'
      placeholder='请选择'
      picker={pickerMode}
      value={dateValue}
      onChange={handleUpdateDate}
      disabledDate={disabledDate}
      allowClear={false}
    />
  </div>
}

export default memo(CombineDatePicker)
