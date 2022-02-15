import { memo } from 'react'
import type { FC } from 'react'
import Button from '@/components/buttons/Button'
import './Buttons.less'

const Buttons: FC = () => <div className='pg-statistics--buttons'>
  <Button type='primary' ghost>导出</Button>
</div>

export default memo(Buttons)
