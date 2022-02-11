import { memo, useState } from 'react'
import type { FC } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import Input from '@/components/form/Input'
import Select from '@/components/form/Select'
import hocFilter from '@/hoc/tableModel/hocFilter'
import DeptSelect from '@/components/form/DeptSelect'
import type { ValuesType } from '@/components/form/DeptSelect'
import './Filters.less'

const FilterInput = hocFilter(
  Input, { name: 'testInput', getValueType: 'targetValue' }
)
const FilterSelect = hocFilter(
  Select, { name: 'testSelect' }
)

const Filters: FC = () => {
  const [v, setV] = useState<ValuesType>([])
  return <div className='pg-balance--filters'>
    <FilterInput
      className='pg-balance--filters--name'
      placeholder='搜索人员姓名'
      prefix={<SearchOutlined />}
    />
    <DeptSelect value={v} onChange={setV} />
    <FilterSelect
      className='pg-balance--filters--status'
      options={[{ label: 'yy', value: 'aa' }, { label: 'xx', value: 'bb' }]}
      placeholder='选择在职情况'
      allowClear
    />
  </div>
}

export default memo(Filters)
