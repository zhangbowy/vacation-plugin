import { memo } from 'react'
import type { FC } from 'react'
import Icon from '@/components/Icon'
import Select from '@/components/form/Select'
import RangePicker from '@/components/form/RangePicker'
import hocFilter from '@/hoc/tableModel/hocFilter'
import InputModel from '@/components/form/InputModel'
import './Filters.less'

const FilterSelect = hocFilter(
  Select, { name: 'testSelect' }
)
const FilterRangePicker = hocFilter(
  RangePicker, { name: 'haha' }
)

const Filters: FC = () => {
  return <div className='pg-log--filters'>
    <InputModel
      className='pg-log--filters--name'
      placeholder='搜索人员姓名'
      prefix={<Icon type='icon-sousuo' />}
    />
    <FilterRangePicker
      className='pg-log--filters--range'
      placeholder={['选择时间', '选择时间']}
      allowClear
    />
    <FilterSelect
      className='pg-log--filters--status'
      options={[{ label: 'yy', value: 'aa' }, { label: 'xx', value: 'bb' }]}
      placeholder='选择操作模块'
      allowClear
    />
  </div>
}

export default memo(Filters)
