import { memo, useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import Icon from '@/components/Icon'
import Select from '@/components/form/Select'
import RangePicker from '@/components/form/RangePicker'
import hocFilter from '@/hoc/tableModel/hocFilter'
import InputModel from '@/components/form/InputModel'
import { getLogModules } from '@/services/operateLog'
import './Filters.less'

const FilterSelect = hocFilter(
  Select, { name: 'operateTypes' }
)
const FilterRangePicker = hocFilter(
  RangePicker, { name: 'rangeTime' }
)

const Filters: FC = () => {
  const [moduleOptions, setModuleOptions] = useState([])
  const refDestroyed = useRef(false)
  useEffect(
    () => {
      refDestroyed.current = false
      getLogModules().then(d => {
        if (d[0] && !refDestroyed.current) {
          setModuleOptions((d[1] || []).map(
            (
              { moduleCode, moduleDesc }:
              { moduleCode: string | number, moduleDesc: string }
            ) =>
              ({ label: moduleDesc, value: moduleCode })
          ))
        }
      })
      return () => {
        refDestroyed.current = true
      }
    },
    []
  )
  return <div className='pg-log--filters'>
    <InputModel
      className='pg-log--filters--name'
      placeholder='搜索人员姓名'
      name='operateUserName'
      prefix={<Icon type='icon-sousuo' />}
    />
    <FilterRangePicker
      className='pg-log--filters--range'
      placeholder={['选择时间', '选择时间']}
      allowClear
    />
    <FilterSelect
      className='pg-log--filters--status'
      options={moduleOptions}
      placeholder='选择操作模块'
      allowClear
    />
  </div>
}

export default memo(Filters)
