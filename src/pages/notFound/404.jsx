import { memo } from 'react';
import { useDispatch } from 'dva';
import Button from '@/components/buttons/Button';
// @ts-ignore
import Nopermission from '@/assets/images/no-permission.png';
import './404.less';
import checkAuth from '@/utils/checkAuth';

const NoFoundPage = () => {
  const dispatch = useDispatch();
  const onClick_addRule = () => {
    // dispatch({
    //   type: 'rules/updateState',
    //   payload: { isShowAddPop: true },
    // });
  };
  return (
    <div className={'rule-empty-wrap'}>
      <div className={'empty-box'}>
        <img src={Nopermission} alt="" />
        <span className={'desc'}>暂无权限</span>
        <span className={'tips'}>可向管理员申请权限</span>
        {/*{checkAuth(1000) && (*/}
        {/*  <Button type="primary" className={'add-rule-btn'} onClick={onClick_addRule}>*/}
        {/*    申请权限*/}
        {/*  </Button>*/}
        {/*)}*/}
      </div>
    </div>
  );
};

export default memo(NoFoundPage);
