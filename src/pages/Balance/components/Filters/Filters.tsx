import { memo, useMemo } from 'react'
import type { FC } from 'react'
import Select from '@/components/form/Select'
import hocFilter from '@/hoc/tableModel/hocFilter'
import InputModel from '@/components/form/InputModel'
import Icon from '@/components/Icon'
import DeptSelect from '@/components/form/DeptSelect'
import './Filters.less'

const getFilters = (tableName: string) => ({
  FilterSelect: hocFilter(
    Select, { name: 'leaveStatus', tableName }
  ),
  FilterDeptSelect: hocFilter(
    DeptSelect, { name: 'deptIds', tableName }
  )
})

const Filters: FC<{ tableName: string }> = ({ tableName }) => {
  const {
    FilterSelect, FilterDeptSelect
  } = useMemo(
    () => getFilters(tableName), [tableName]
  )
  return <div className='pg-balance--filters'>
    <InputModel
      className='pg-balance--filters--name'
      tableName={tableName}
      name='userName'
      placeholder='搜索人员姓名'
      prefix={<Icon type='icon-sousuo' />}
    />
    <FilterDeptSelect
      className='pg-balance--filters--dept'
    />
    <FilterSelect
      className='pg-balance--filters--status'
      options={[{ label: '在职', value: 0 }, { label: '离职', value: 1 }]}
      placeholder='选择在职情况'
      allowClear
    />
  </div>
}

export default memo(Filters)
