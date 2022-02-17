import { memo } from 'react'
import type { FC } from 'react'
import './RecordOptions.less'
import Button from '@/components/buttons/Button'
import Select from '@/components/form/Select'
import Icon from '@/components/Icon'
import RangePicker from '@/components/form/RangePicker'
import InputModel from '@/components/form/InputModel'
import hocFilter from '@/hoc/tableModel/hocFilter'

const FilterSelect = hocFilter(
  Select, { name: 'testSelect' }
)
const FilterRangePicker = hocFilter(
  RangePicker, { name: 'haha' }
)

const RecordOptions: FC = () =>
  <div className='pg-overview--record-options'>
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
    <Button type="primary" key="primary">
      导出
    </Button>
  </div>

export default memo(RecordOptions)
