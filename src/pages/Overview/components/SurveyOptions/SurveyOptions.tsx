import { memo, useCallback } from 'react'
import type { FC } from 'react'
import './SurveyOptions.less'
import DatePicker from '@/components/form/DatePicker'
import type { Moment } from 'moment'
import Icon from '@/components/Icon'

interface SurveyOptionsProps {
  value: Moment
  onChange: (x: Moment | null) => void
}

const SurveyOptions: FC<SurveyOptionsProps> = ({
  value, onChange
}) => {
  const handlePrev = useCallback(
    () => {
      if (onChange) {
        onChange(value.clone().subtract(1, 'months'))
      }
    },
    [value, onChange]
  )
  const handleNext = useCallback(
    () => {
      if (onChange) {
        onChange(value.clone().add(1, 'months'))
      }
    },
    [value, onChange]
  )
  return <div className='pg-overview--survey-options'>
    <div className='pg-overview--survey-options--date-filter'>
      <Icon
        className='pg-overview--survey-options--prev'
        type='icon-zuojiantou'
        onClick={handlePrev}
      />
      <DatePicker
        className='pg-overview--survey-options--picker'
        picker='month'
        value={value}
        onChange={onChange}
        allowClear={false}
        format='YYYY年M月'
      />
      <Icon
        className='pg-overview--survey-options--next'
        type='icon-youjiantou'
        onClick={handleNext}
      />
    </div>
  </div>
}

export default memo(SurveyOptions)
