import { memo, useState } from 'react'
import type { FC } from 'react'
import moment from 'moment'
import type { Moment } from 'moment'
import './CombineDatePicker.less'
import Select from '@/components/form/Select'
import DatePicker from '@/components/form/DatePicker'

const disabledDate = (c: Moment) => c > moment().endOf('day')

const CombineDatePicker: FC = () => {
  const [pickerMode, setPickerMode] = useState<'year' | 'month'>('year')
  return <div className='pg-statistics--combine-date-picker'>
    <Select
      className='pg-statistics--combine-date-picker--select'
      options={[
        { label: '按年', value: 'year' }, { label: '按月', value: 'month' }
      ]}
      value={pickerMode}
      onChange={setPickerMode}
    />
    <DatePicker
      className='pg-statistics--combine-date-picker--picker'
      placeholder='请选择'
      picker={pickerMode}
      disabledDate={disabledDate}
    />
  </div>
}

export default memo(CombineDatePicker)
