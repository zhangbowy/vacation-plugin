import { memo, useEffect } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent';
import StoreTable from '@/components/table/StoreTable';
import { useDispatch } from 'dva';
import { getBalanceList } from '@/services/balance';
import Header from './components/Header';
// import Filters from './components/Filters'
import Buttons from './components/Buttons';
import Empty from './components/Empty';
import AddRulePop from './components/AddRulePop';
import './Rules.less';

const defaultColumns = [
  { title: '假期名称', dataIndex: 'userName' },
  { title: '请假单位', dataIndex: 'jobNumber' },
  { title: '请假计算时长方式', dataIndex: 'deptName' },
  { title: '是否带薪', dataIndex: 'job' },
  { title: '适用范围', dataIndex: 'job' },
];
const getColumns = (cell?: any) => {
  if (cell && cell[0] && cell[0].balanceDetails) {
    return [
      ...defaultColumns,
      ...cell[0].balanceDetails.map(
        ({ ruleId, ruleName, unit }: { ruleId: number; ruleName: string; unit: string }) => ({
          title: `${ruleName}(${unit})`,
          dataIndex: ruleId,
        }),
      ),
    ];
  }
  return defaultColumns;
};

const Rules: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'table/initTable',
      payload: {
        name: 'balance',
        action: getBalanceList,
        columns: getColumns(),
        paramsHandle: (p: Record<string, any> = {}, pageNo: number, pageSize: number) => {
          const { deptIds, ...rest } = p;
          if (deptIds && deptIds.length > 0) {
            rest.deptIds = deptIds.map(({ id }: { id: string | number }) => id).join(',');
          }
          rest.pageNo = pageNo || 1;
          rest.pageSize = pageSize || 10;
          return rest;
        },
        resultHandle: (r: any) => {
          if (r && r.list) {
            getColumns(r.list);
            return {
              ...r,
              ...r.list.map(
                ({
                  balanceDetails,
                  ...rest
                }: {
                  balanceDetails: { ruleId: number; balance: number }[];
                }) => {
                  if (balanceDetails && Array.isArray(balanceDetails)) {
                    const extra = {};
                    balanceDetails.forEach(({ ruleId, balance }) => (extra[ruleId] = balance));
                    return {
                      ...rest,
                      ...extra,
                    };
                  }
                  return rest;
                },
              ),
            };
          }

          return r;
        },
      },
    });
  }, [dispatch]);
  return (
    <PageContent className="pg-balance" hasPadding>
      <Header />
      {/* eslint-disable-next-line no-constant-condition */}
      {true ? (
        <Empty />
      ) : (
        <>
          <div className="pg-balance--options">
            {/*<Filters />*/}
            <Buttons />
          </div>
          <StoreTable name="balance" rowKey="userId" withFooterPaination />
          {/*<BalanceDetail visible={visible} onClose={handleCloseDetail} />*/}
        </>
      )}
      {/*新增假期规则弹窗*/}
      <AddRulePop />
    </PageContent>
  );
};

export default memo(Rules);
