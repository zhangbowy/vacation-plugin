import { memo } from 'react'
import type { FC } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import Select from '@/components/form/Select'
import hocFilter from '@/hoc/tableModel/hocFilter'
import InputModel from '@/components/form/InputModel'
import CombineDatePicker from '../CombineDatePicker'
import './Filters.less'

const FilterSelect = hocFilter(
  Select, { name: 'testSelect' }
)

const Filters: FC = () => {
  return <div className='pg-statistics--filters'>
    <InputModel
      className='pg-statistics--filters--name'
      placeholder='搜索人员姓名'
      prefix={<SearchOutlined />}
    />
    <CombineDatePicker />
    <FilterSelect
      className='pg-statistics--filters--status'
      options={[{ label: 'yy', value: 'aa' }, { label: 'xx', value: 'bb' }]}
      placeholder='选择在职情况'
      allowClear
    />
  </div>
}

export default memo(Filters)
