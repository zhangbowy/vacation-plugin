import { memo } from 'react'
import type { FC } from 'react'
import './BalanceBatchEdit.less'
import Header from './components/Header'
import Content from './components/Content'

const BalanceBatchEdit: FC = () =>
  <div className='pg-balance-batch-edit'>
    <Header />
    <Content />
  </div>

export default memo(BalanceBatchEdit)
