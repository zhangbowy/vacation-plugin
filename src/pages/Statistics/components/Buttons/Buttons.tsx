import { memo } from 'react'
import type { FC } from 'react'
import Button from '@/components/buttons/Button'
import './Buttons.less'
import { useSelector } from 'dva'
import { defaultParamsHandle } from '@/models/table'
import { exportStatisticsList } from '@/services/statistics'

const Buttons: FC = () => {
  const { params, paramsHandle } = useSelector(state => ({
    params: state.table.params,
    paramsHandle: state.table.paramsHandle
  }))
  const handleExport = () => {
    const p = (paramsHandle || defaultParamsHandle)(params)
    delete p.pageNo
    delete p.pageSize
    exportStatisticsList(p)
  }
  return <div className='pg-statistics--buttons'>
    <Button type='primary' ghost onClick={handleExport}>导出</Button>
  </div>
}

export default memo(Buttons)
