import { memo, useMemo } from 'react'
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
import checkAuth from '@/utils/checkAuth'

const getFilters = (tableName: string) => ({
  FilterSelect: hocFilter(
    Select, { name: 'ruleId', tableName }
  ),
  FilterRangePicker: hocFilter(
    RangePicker, { name: 'date', tableName }
  )
})

interface RecordOptionsProps {
  ruleOptions: OptionProps[]
  tableName: string
}

const RecordOptions: FC<RecordOptionsProps> = ({ ruleOptions, tableName }) => {
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
  const {
    FilterSelect, FilterRangePicker
  } = useMemo(
    () => getFilters(tableName),
    [tableName]
  )
  return <div className='pg-overview--record-options'>
    <div className='pg-overview--record-options--filters'>
      <InputModel
        className='pg-overview--record-options--filters-name'
        placeholder='搜索人员姓名'
        prefix={<Icon type='icon-sousuo' />}
        tableName={tableName}
        name='search'
      />
      <FilterSelect
        className='pg-overview--record-options--filters-status'
        options={ruleOptions}
        placeholder='假期名称'
        allowClear
      />
      <FilterRangePicker
        className='pg-overview--record-options--filters-range'
        placeholder={['选择时间', '选择时间']}
      />
    </div>
    {
      checkAuth(4003) &&
      <Button type='primary' ghost onClick={handleExport}>
        导出
      </Button>
    }
  </div>
}

export default memo(RecordOptions)
