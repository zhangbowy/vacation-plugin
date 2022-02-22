import { memo } from 'react'
import type { FC } from 'react'
import Icon from '@/components/Icon'
import Select from '@/components/form/Select'
import hocFilter from '@/hoc/tableModel/hocFilter'
import InputModel from '@/components/form/InputModel'
import CombineDatePicker from '../CombineDatePicker'
import './Filters.less'

const FilterSelect = hocFilter(
  Select, { name: 'status' }
)

const options = [
  { label: '在职', value: 1 },
  { label: '离职', value: 0 }
]

const Filters: FC = () => {
  return <div className='pg-statistics--filters'>
    <InputModel
      className='pg-statistics--filters--name'
      placeholder='搜索人员姓名'
      name='search'
      prefix={<Icon type='icon-sousuo' />}
    />
    <CombineDatePicker />
    <FilterSelect
      className='pg-statistics--filters--status'
      options={options}
      placeholder='选择在职情况'
    />
  </div>
}

export default memo(Filters)
