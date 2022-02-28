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
import { getRulesList, delRule, addRule } from '@/services/rules';
import getActions from '@/components/table/getAction';
import checkAuth from '@/utils/checkAuth';
import { confirm } from '@/components/pop/Modal';
import loading from '@/components/pop/loading';
import { msg } from '@/components/pop';

interface AgeRules {
  type: string;
  minAge: number;
  maxAge: number;
  quota: number;
}

interface ExpireRule {
  expireType: string;
  fixedTime: number;
  fixedUnit: string;
  nextMonthValue: string;
  specifyDay: string;
  untilDay: string;
  isExtended: boolean;
  extendedTime: string;
  extendedUnit: string;
  expireRemindFlag: boolean;
  advanceRemindTime: string;
  advanceRemindUnit: string;
  remindScopeList: any[];
  remindRoles: number[];
  expireHandleType: string;
}

interface LeaveCertificate {
  duration: number;
  enable: boolean;
  unit: string;
  promptInformation: string;
}

interface QuotaRule {
  quotaType: string;
  fixedQuota: number;
  ageRules: AgeRules[];
  averageType: string;
  roundType: string;
  roundStep: number;
}

interface Result {
  id: string;
  corpId: string;
  companyId: string;
  vacationTypeRule: VacationTypeRule;
  vacationIssueRule: VacationIssueRule;
}

interface RuleResult {
  success: boolean;
  errorCode: string;
  errorMsg: string;
  result: Result[];
  arguments: any[];
}

interface SubmitTimeRule {
  timeType: string;
  timeUnit: string;
  timeValue: number;
  enableTimeLimit: boolean;
}

interface TargetRule {
  targetType: string;
  minAge: number;
  maxAge: number;
  sex: number;
}

interface TimeRule {
  issueType: string;
  issueTimeType: string;
  issueDayOfMonth: number;
  issueDayOfYear: string;
  isEntryDayOnFirst: boolean;
}

interface VacationIssueRule {
  timeRule: TimeRule;
  targetRule: TargetRule;
  quotaRule: QuotaRule;
  expireRule: ExpireRule;
}

interface VacationTypeRule {
  leaveCode: string;
  bizType: string;
  leaveName: string;
  whenCanLeave: string;
  visibilityRules: VisibilityRules[];
  paidLeave: boolean;
  leaveViewUnit: string;
  hoursInPerDay: number;
  leaveHourCeil: string;
  leaveTimeCeilMinUnit: string;
  minLeaveHour: number;
  maxLeaveTime: number;
  naturalDayLeave: boolean;
  submitTimeRule: SubmitTimeRule;
  leaveCertificate: LeaveCertificate;
}

interface VisibilityRules {
  type: string;
  visible: string[];
}

const defaultColumns = [
  {
    title: '假期名称',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return d.leaveName || '-';
    },
  },
  {
    title: '请假单位',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return d.leaveViewUnit || '-';
    },
  },
  {
    title: '请假计算时长方式',
    dataIndex: 'deptName',
    render: (d: VacationTypeRule) => {
      return d?.naturalDayLeave ? '按工作日计算' : '-';
    },
  },
  {
    title: '是否带薪',
    dataIndex: 'job',
    render: (d: VacationTypeRule) => {
      return d?.paidLeave ? '是' : '否';
    },
  },
  { title: '适用范围', dataIndex: 'job' },
];

const Rules: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'table/initTable',
      payload: {
        name: 'rule',
        action: getRulesList,
        columns: getColumns(),
        paramsHandle: (p: Record<string, any> = {}, pageNo: number, pageSize: number) => {
          const { ...rest } = p;
          rest.pageNo = pageNo || 1;
          rest.pageSize = pageSize || 10;
          return rest;
        },
        resultHandle: (fetchResult: Result[]) => {
          return {
            list: fetchResult.map((v: any, i: number) => ({ ...v, key: i })),
          };
        },
      },
    });
  }, [dispatch]);

  useEffect(() => {
    init();
  }, []);

  const onClick_edit = (d: Result) => {};

  const Add = (d: Result) => {
    const param = {};
    addRule(param).then((res) => {});
  };

  const onClick_del = (d: Result) => {
    confirm({
      title: '提示',
      content: '确定要删除假期规则吗？',
      onOk: () => {
        loading.show();
        delRule({ id: d.id, leaveCode: d.vacationTypeRule.leaveCode })
          .then(([success]) => {
            if (success) {
              msg('删除成功');
              dispatch({ type: 'table/refreshTable' });
            }
          })
          .finally(() => {
            loading.hide();
          });
      },
    });
  };

  const getColumns = () => {
    const actionsReturn = getActions({
      width: 120,
      getHandles: (v: any) => {
        const r = [];
        if (checkAuth(6003)) {
          r.push({
            title: '编辑',
            handle: onClick_edit,
          });
        }
        if (checkAuth(6004)) {
          r.push({
            title: '删除',
            handle: onClick_del,
          });
        }
        return r;
      },
    });
    return [...defaultColumns, actionsReturn];
  };

  const init = () => {};

  return (
    <PageContent className="pg-balance" hasPadding>
      <Header />
      {false ? (
        <Empty />
      ) : (
        <>
          <div className="pg-balance--options">
            {/*<Filters />*/}
            <Buttons />
          </div>
          <StoreTable name="rule" rowKey="key" withFooterPaination />
          {/*<BalanceDetail visible={visible} onClose={handleCloseDetail} />*/}
        </>
      )}

      {/*新增假期规则弹窗*/}
      <AddRulePop />
    </PageContent>
  );
};

export default memo(Rules);
