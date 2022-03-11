import { memo } from 'react';
import type { FC } from 'react';
import { useDispatch } from 'dva';
import Button from '@/components/buttons/Button';
// @ts-ignore
import EmptyImage from '@/assets/images/rule/empty.png';
import './Empty.less';
import checkAuth from '@/utils/checkAuth';
import Icon from '@/components/Icon/Icon';

const Empty: FC = () => {
  const dispatch = useDispatch();
  const onClick_addRule = () => {
    dispatch({
      type: 'rules/updateState',
      payload: { isShowAddPop: true },
    });
  };
  return (
    <div className={'rule-empty-wrap'}>
      <div className={'empty-box'}>
        <img src={EmptyImage} alt="" />
        <span className={'desc'}>暂无任何规则</span>
        <span className={'tips'}>可以点击下方按钮添加规则</span>
        {checkAuth(1000) && (
          <Button type="primary" className={'add-rule-btn'} onClick={onClick_addRule}>
            <Icon type="icon-tianjia" />
            添加规则
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(Empty);
