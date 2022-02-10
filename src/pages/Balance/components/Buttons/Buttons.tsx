import { memo } from 'react'
import type { FC } from 'react'
import Button from '@/components/buttons/Button'
import './Buttons.less'

const Buttons: FC = () => <div className='pg-balance--buttons'>
  <Button className='buttons'>使用Excel批量修改</Button>
  <Button className='buttons' type='primary' ghost>导出</Button>
</div>

export default memo(Buttons)
