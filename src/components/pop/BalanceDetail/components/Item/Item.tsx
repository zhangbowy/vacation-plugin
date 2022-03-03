import { memo } from 'react'
import type { FC } from 'react'
import './Item.less'
import moment from 'moment'
import Icon from '@/components/Icon'

const getContext = (item: any) => {
  const {
    changeType,
    changeDurationType,
    changeDuration,
    createUserName,
    userName,
    startTime,
    endTime
  } = item
  if (changeType === 4) {
    return `${
      userName ? `${userName} ` : ''
    }使用了${
      (changeDuration || 0) / 100
    }${
      changeDurationType === 0 ? '天' : '小时'
    }调休假`
  }
  return `${
    createUserName ? `${createUserName} 为 `: ''
  }${
    userName ? `${userName} ` : ''
  }${
    changeType === 0 || changeType === 1
      ? '增加了'
      : '减少了'
  }${
    (changeDuration || 0) / 100
  }${changeDurationType === 0 ? '天' : '小时'}调休假${
    startTime && endTime
      ? `，${
        moment(startTime).format('YYYY-MM-DD')
      }至${
        moment(endTime).format('YYYY-MM-DD')
      }有效`
      : ''
  }`
}

const Item: FC<{ list: any[] }> = ({ list }) => <>
  {
    list.map(
      v => {
        const {
          createTime,
          id,
          changeType,
          changeDurationType,
          changeDuration
        } = v
        const date = moment(createTime).format('YYYY-MM-DD')
        const time = moment(createTime).format('HH-mm')
        return <div key={id} className='com-pop-balance-detail--item'>
          <div className='com-pop-balance-detail--item--graph'>
            <Icon
              className='com-pop-balance-detail--item--icon'
              type='icon-shizhong'
            />
            <div className='com-pop-balance-detail--item--line' />
          </div>
          <div className='com-pop-balance-detail--item--datetime'>
            <p className='com-pop-balance-detail--item--date'>{ date }</p>
            <p className='com-pop-balance-detail--item--time'>{ time }</p>
          </div>
          <div className='com-pop-balance-detail--item--content'>
            <p className='com-pop-balance-detail--item--change font-bolder'>
              {
                `${
                  !changeDuration || changeType === 0 || changeType === 1
                    ? ''
                    : '-'
                }${
                  (changeDuration || 0) / 100
                }${
                  changeDurationType === 0 ? '天' : '小时'
                }`
              }
            </p>
            <p className='com-pop-balance-detail--item--description'>
              { getContext(v) }
            </p>
          </div>
        </div>
      }
    )
  }
</>

export default memo(Item)
