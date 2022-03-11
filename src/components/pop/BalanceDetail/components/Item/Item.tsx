import { memo } from 'react';
import type { FC } from 'react';
import './Item.less';
import moment from 'moment';
import Icon from '@/components/Icon';

const getContext = (item: any, title: string) => {
  const {
    changeType,
    changeDurationType,
    changeDuration,
    createUserName,
    userName,
    startTime,
    endTime,
    sumDuration,
  } = item;
  const unit = changeDurationType === 0 ? '天' : '小时';
  if (changeType === 4) {
    return `${userName ? `${userName} ` : ''}使用了${
      (changeDuration || 0) / 100
    }${unit}的假期，当前剩余${(sumDuration || 0) / 100}${unit}${
      startTime && endTime
        ? `，${moment(startTime).format('YYYY-MM-DD')}至${moment(endTime).format('YYYY-MM-DD')}有效`
        : ''
    }`;
  }
  if (changeType === 3) {
    return `假期过期${(changeDuration || 0) / 100}${unit}，当前剩余${
      (sumDuration || 0) / 100
    }${unit}${
      startTime && endTime
        ? `，${moment(startTime).format('YYYY-MM-DD')}至${moment(endTime).format('YYYY-MM-DD')}有效`
        : ''
    }`;
  }
  if (changeType === 1 || changeType === 2) {
    return `${createUserName ? `${createUserName} 为 ` : ''}${userName ? `${userName} ` : ''}${
      changeType === 1 ? '增加了' : '减少了'
    }${(changeDuration || 0) / 100}${unit}的${title}，当前剩余${(sumDuration || 0) / 100}${unit}${
      startTime && endTime
        ? `，${moment(startTime).format('YYYY-MM-DD')}至${moment(endTime).format('YYYY-MM-DD')}有效`
        : ''
    }`;
  }
  return `系统按照规则自动${changeType === 0 ? '增加了' : '减少了'}${
    (changeDuration || 0) / 100
  }${unit}的${title}，当前剩余${(sumDuration || 0) / 100}${unit}${
    startTime && endTime
      ? `，${moment(startTime).format('YYYY-MM-DD')}至${moment(endTime).format('YYYY-MM-DD')}有效`
      : ''
  }`;
};

const Item: FC<{ list: any[]; title: string }> = ({ list, title }) => (
  <>
    {list.map((v) => {
      const { createTime, id, changeType, changeDurationType, changeDuration } = v;
      const date = moment(createTime).format('YYYY-MM-DD');
      const time = moment(createTime).format('HH:mm');
      return (
        <div key={id} className="com-pop-balance-detail--item">
          <div className="com-pop-balance-detail--item--graph">
            <Icon className="com-pop-balance-detail--item--icon" type="icon-shizhong" />
            <div className="com-pop-balance-detail--item--line" />
          </div>
          <div className="com-pop-balance-detail--item--datetime">
            <p className="com-pop-balance-detail--item--date">{date}</p>
            <p className="com-pop-balance-detail--item--time">{time}</p>
          </div>
          <div className="com-pop-balance-detail--item--content">
            <p className="com-pop-balance-detail--item--change font-bolder">
              {`${!changeDuration || changeType === 0 || changeType === 1 ? '+' : '-'}${
                (changeDuration || 0) / 100
              }${changeDurationType === 0 ? '天' : '小时'}`}
            </p>
            <p className="com-pop-balance-detail--item--description">{getContext(v, title)}</p>
          </div>
        </div>
      );
    })}
  </>
);

export default memo(Item);
