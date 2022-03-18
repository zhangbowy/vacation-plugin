import { memo } from 'react';
import type { FC } from 'react';
import { useSelector } from 'dva';
import Button from '@/components/buttons/Button';
import { defaultParamsHandle } from '@/models/table';
import { exportBalanceList } from '@/services/balance';
import { history } from 'umi';
import checkAuth from '@/utils/checkAuth';
import './Buttons.less';

const Buttons: FC = () => {
  const { params, paramsHandle } = useSelector((state) => ({
    params: state.table.params,
    paramsHandle: state.table.paramsHandle,
  }));
  const handleBatchEdit = () => {
    history.push('/balance/batch-edit');
  };
  const handleExport = () => {
    const p = (paramsHandle || defaultParamsHandle)(params);
    delete p.pageNo;
    delete p.pageSize;
    exportBalanceList(p);
  };
  return (
    <div className="pg-balance--buttons">
      {
        checkAuth(2002) &&
        <Button onClick={handleBatchEdit}>使用Excel批量修改</Button>
      }
      {
        checkAuth(2003) && (
          <Button type="primary" ghost onClick={handleExport}>
            导出
          </Button>
        )
      }
    </div>
  );
};

export default memo(Buttons);
