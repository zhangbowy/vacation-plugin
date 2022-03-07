import React, { memo, useEffect } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent';
import StoreTable from '@/components/table/StoreTable';
import { useDispatch, useSelector } from 'dva';
import Header from './components/Header';
// import Filters from './components/Filters'
import Buttons from './components/Buttons';
import Empty from './components/Empty';
import AddRulePop from './components/AddRulePop';
import './Rules.less';
import { getRulesList, delRule } from '@/services/rules';
import getActions from '@/components/table/getAction';
import checkAuth from '@/utils/checkAuth';
import { confirm } from '@/components/pop/Modal';
import loading from '@/components/pop/loading';
import { msg } from '@/components/pop';
import { leaveViewUnit } from '@/constant/rule';
import Tooltip from '@/components/pop/Tooltip/Tooltip';
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
  visibilityRulesStrHover: string;
  visibilityRulesStr: string;
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
      return (
        <>
          <span>{d.leaveName}</span>
          {d.bizType === 'lieu_leave' && <span className={'lieu-title'}>调休假</span>}
        </>
      );
    },
  },
  {
    title: '请假单位',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return leaveViewUnit[d.leaveViewUnit] || '-';
    },
  },
  {
    title: '请假计算时长方式',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return d?.naturalDayLeave ? '按照自然日计算时长' : '按照工作日计算时长';
    },
  },
  {
    title: '是否带薪',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return d?.paidLeave ? '是' : '否';
    },
  },
  {
    title: '适用范围',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return (
        <Tooltip overlayClassName="leave-unit--tooltip" title={d.visibilityRulesStrHover}>
          <span>{d.visibilityRulesStr}</span>
        </Tooltip>
      );
    },
  },
];

const Rules: FC = () => {
  const dispatch = useDispatch();
  const { isShowAddPop, total } = useSelector((state) => ({
    isShowAddPop: state.rules.isShowAddPop,
    editInfo: state.rules.editInfo,
    total: state.table.total,
  }));
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
        resultHandle: (fetchResult: any, _: number, pageSize: number) => {
          const { page = {}, list, ...rest } = fetchResult || {};
          const { currentPage = 1, total = 0 } = page;
          return {
            list: list.map((v: any, i: number) => {
              if (v.vacationTypeRule.bizType === 'lieu_leave') {
                dispatch({
                  type: 'rules/updateState',
                  payload: { hasLieuLeave: true },
                });
              }
              const visibilityRules = v.vacationTypeRule.visibilityRules;
              let visibilityRulesStr = '全员';
              let visibilityRulesStrHover = '全员';
              if (visibilityRules && visibilityRules.length > 0) {
                visibilityRulesStr = '';
                visibilityRulesStrHover = '';
                visibilityRules.forEach(({ type, visible = [], details = [] }) => {
                  if (type === 'dept') {
                    if (visible.length) {
                      visibilityRulesStr = visibilityRulesStr + `${visible.length}个部门`;
                    }
                    visibilityRulesStrHover =
                      visibilityRulesStrHover + details.map((item) => item.name).join(',');
                  }
                  if (type === 'staff') {
                    if (visible.length) {
                      if (visibilityRulesStr) {
                        visibilityRulesStr = visibilityRulesStr + ',';
                        visibilityRulesStrHover = visibilityRulesStrHover + ',';
                      }
                      visibilityRulesStr = visibilityRulesStr + `${visible.length}个人`;
                    }
                    visibilityRulesStrHover =
                      visibilityRulesStrHover + details.map((item) => item.name).join(',');
                  }
                });
              }
              return {
                ...v,
                key: i,
                vacationTypeRule: {
                  ...v.vacationTypeRule,
                  visibilityRulesStr,
                  visibilityRulesStrHover,
                },
              };
            }),
            ...rest,
            total,
            pageNo: currentPage,
            pageSize,
          };
        },
      },
    });
  }, [dispatch]);

  useEffect(() => {
    init();
  }, []);

  const onClick_edit = (d: Result) => {
    dispatch({
      type: 'rules/updateState',
      payload: { isShowAddPop: true, editInfo: d },
    });
  };

  const onClick_copy = (d: Result) => {
    dispatch({
      type: 'rules/updateState',
      payload: { isShowAddPop: true, editInfo: d, isCopy: true },
    });
  };

  // 删除规则
  const onClick_del = (d: Result) => {
    confirm({
      title: '确定删除吗？',
      content: (
        <span style={{ color: 'rgba(23, 26, 29, 0.6)' }}>
          删除后，所有员工余额、假期使用记录将被清除，数据不可恢复，请谨慎操作!
        </span>
      ),
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
      width: 150,
      getHandles: (v: any) => {
        const has_lieu_leave = v.vacationTypeRule.bizType === 'lieu_leave';
        const r = [];
        if (checkAuth(1003)) {
          r.push({
            title: '编辑',
            handle: onClick_edit,
          });
        }
        if (checkAuth(1003)) {
          r.push({
            title: has_lieu_leave ? (
              <Tooltip overlayClassName="leave-unit--tooltip" title={'只允许存在一个调休假'}>
                <span>复制</span>
              </Tooltip>
            ) : (
              <span>复制</span>
            ),
            handle: onClick_copy,
            disabled: has_lieu_leave,
          });
        }
        if (checkAuth(1004)) {
          r.push({
            title: '删除',
            handle: onClick_del,
            disabled: has_lieu_leave,
          });
        }
        return r;
      },
    });
    return [...defaultColumns, actionsReturn];
  };

  const init = () => {};

  return (
    <PageContent className="pg-rules" hasPadding>
      <Header />
      {!total ? (
        <Empty />
      ) : (
        <>
          <div className="pg-rules--options">
            <Buttons />
          </div>
          <StoreTable name="rule" rowKey="id" withFooterPagination />
        </>
      )}
      {/*新增假期规则弹窗*/}
      {isShowAddPop && <AddRulePop />}
    </PageContent>
  );
};

export default memo(Rules);
