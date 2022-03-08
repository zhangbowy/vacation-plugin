import { memo } from 'react';
import type { FC } from 'react';
import { useDispatch } from 'dva';
import Button from '@/components/buttons/Button';
import './Buttons.less';
import Icon from '@/components/Icon/Icon';
// eslint-disable-next-line react-hooks/rules-of-hooks
const Buttons: FC = () => {
  const dispatch = useDispatch();

  // 抽屉显示隐藏
  // const [isShowAddPop, setIsShowAddPop] = useState(false);
  const onClick_addRule = () => {
    dispatch({
      type: 'rules/updateState',
      payload: { isShowAddPop: true },
    });
  };
  return (
    <div className="pg-balance--buttons">
      <Button type="primary" onClick={onClick_addRule}>
        <Icon type="icon-tianjia" />
        添加规则
      </Button>
    </div>
  );
};

export default memo(Buttons);
