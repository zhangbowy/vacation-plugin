import { memo } from 'react'
import type { FC } from 'react'
import './Item.less'
import Icon from '@/components/Icon'

const Item: FC = () => <>
  <div className='com-pop-balance-detail--item'>
    <div className='com-pop-balance-detail--item--graph'>
      <Icon
        className='com-pop-balance-detail--item--icon'
        type='icon-shizhong'
      />
      <div className='com-pop-balance-detail--item--line' />
    </div>
    <div className='com-pop-balance-detail--item--datetime'>
      <p className='com-pop-balance-detail--item--date'>2022-01-28</p>
      <p className='com-pop-balance-detail--item--time'>11:43</p>
    </div>
    <div className='com-pop-balance-detail--item--content'>
      <p className='com-pop-balance-detail--item--change font-bolder'>
        -8.0小时
      </p>
      <p className='com-pop-balance-detail--item--description'>
        张三 为 湛刚青 增加了8.0小时调休假，2021-09-08至2022-09-08有效
      </p>
    </div>
    </div>
    <div className='com-pop-balance-detail--item'>
    <div className='com-pop-balance-detail--item--graph'>
      <Icon className='com-pop-balance-detail--item--icon' type='icon-shizhong' />
      <div className='com-pop-balance-detail--item--line' />
    </div>
    <div className='com-pop-balance-detail--item--datetime'>
      <p className='com-pop-balance-detail--item--date'>2022-01-28</p>
      <p className='com-pop-balance-detail--item--time'>11:43</p>
    </div>
    <div className='com-pop-balance-detail--item--content'>
      <p className='com-pop-balance-detail--item--change font-bolder'>
        -8.0小时
      </p>
      <p className='com-pop-balance-detail--item--description'>
        张三 为 湛刚青 增加了8.0小时调休假，2021-09-08至2022-09-08有效
      </p>
    </div>
  </div>
</>

export default memo(Item)
