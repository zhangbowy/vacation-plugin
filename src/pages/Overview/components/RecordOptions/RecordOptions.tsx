import { memo } from 'react'
import type { FC } from 'react'
import './RecordOptions.less'
import { useSelector } from 'dva'
import Button from '@/components/buttons/Button'
import Select from '@/components/form/Select'
import Icon from '@/components/Icon'
import { defaultParamsHandle } from '@/models/table'
import RangePicker from '@/components/form/RangePicker'
import InputModel from '@/components/form/InputModel'
import hocFilter from '@/hoc/tableModel/hocFilter'
import { exportLeaveRecord } from '@/services/leave'

const FilterSelect = hocFilter(
  Select, { name: 'testSelect' }
)
const FilterRangePicker = hocFilter(
  RangePicker, { name: 'haha' }
)

const RecordOptions: FC = () => {
  const { params, paramsHandle } = useSelector(state => ({
    params: state.table.params,
    paramsHandle: state.table.paramsHandle
  }))
  const handleExport = () => {
    
    const p = (paramsHandle || defaultParamsHandle)(params)
    delete p.pageNo
    delete p.pageSize
    exportLeaveRecord(p)
  }
  return <div className='pg-overview--record-options'>
    <div className='pg-overview--record-options--filters'>
      <InputModel
        className='pg-overview--record-options--filters-name'
        placeholder='搜索人员姓名'
        prefix={<Icon type='icon-sousuo' />}
      />
      <FilterSelect
        className='pg-overview--record-options--filters-status'
        options={[{ label: 'yy', value: 'aa' }, { label: 'xx', value: 'bb' }]}
        placeholder='假期名称'
        allowClear
      />
      <FilterRangePicker
        className='pg-overview--record-options--filters-range'
        placeholder={['选择时间', '选择时间']}
        allowClear
      />
    </div>
    <Button type='primary' key='primary' onClick={handleExport}>
      导出
    </Button>
  </div>
}

export default memo(RecordOptions)
