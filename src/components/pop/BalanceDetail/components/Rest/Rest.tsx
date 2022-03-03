import { memo } from 'react'
import type { FC } from 'react'
import './Rest.less'
import Button from '@/components/buttons/Button'

interface RestProps {
  onModalOpen: VoidFunction
  data: { durationType?: 0 | 2, duration?: number }
}

const Rest: FC<RestProps> = ({ onModalOpen, data }) =>
  <div className='com-pop-balance-detail--rest'>
    <span className='com-pop-balance-detail--rest--title'>当前调休假余额：</span>
    <span className='com-pop-balance-detail--rest--count'>
      {
        `${(data.duration || 0) / 100}${data.durationType === 0 ? '天' : '小时'}`
      }
    </span>
    <Button
      className='com-pop-balance-detail--rest--button'
      type='primary'
      ghost
      size='small'
      onClick={onModalOpen}
    >
      修改余额
    </Button>
  </div>

export default memo(Rest)
