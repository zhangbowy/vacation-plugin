import React, { memo, useEffect } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent';
import StoreTable from '@/components/table/StoreTable';
import { useDispatch, useSelector } from 'dva';
import Header from './components/Header';
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
import { ExclamationCircleFilled } from '@ant-design/icons';

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
    title: '????????????',
    dataIndex: 'vacationTypeRule',
    width: 140,
    render: (d: VacationTypeRule) => {
      return (
        <>
          <span>
            {d.leaveName.length > 11 ? d.leaveName.substring(0, 11) + '...' : d.leaveName}
          </span>
          {d.bizType === 'lieu_leave' && <span className={'lieu-title'}>?????????</span>}
        </>
      );
    },
  },
  {
    title: '????????????',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return leaveViewUnit[d.leaveViewUnit] || '-';
    },
  },
  {
    title: '????????????????????????',
    dataIndex: 'vacationTypeRule',
    width: 220,
    render: (d: VacationTypeRule) => {
      return d?.naturalDayLeave ? '???????????????????????????' : '???????????????????????????';
    },
  },
  {
    title: '????????????',
    dataIndex: 'vacationTypeRule',
    render: (d: VacationTypeRule) => {
      return d?.paidLeave ? '???' : '???';
    },
  },
  {
    title: '????????????',
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
  const { isShowAddPop, total, inLoading } = useSelector((state) => ({
    isShowAddPop: state.rules.isShowAddPop,
    editInfo: state.rules.editInfo,
    total: state.table.total,
    inLoading: state.table.inLoading,
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
              const visibilityRules = v.vacationTypeRule.visibilityRules;
              let visibilityRulesStr = '??????';
              let visibilityRulesStrHover = '??????';
              if (!v.vacationTypeRule.isAllCompany) {
                if (visibilityRules && visibilityRules.length > 0) {
                  visibilityRulesStr = '';
                  visibilityRulesStrHover = '';
                  visibilityRules.forEach(({ type, visible = [], details = [] }) => {
                    if (type === 'dept') {
                      if (visible.length) {
                        visibilityRulesStr = visibilityRulesStr + `${visible.length}?????????`;
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
                        visibilityRulesStr = visibilityRulesStr + `${visible.length}??????`;
                      }
                      visibilityRulesStrHover =
                        visibilityRulesStrHover + details.map((item) => item.name).join(',');
                    }
                  });
                }
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

  // ????????????
  const onClick_del = (d: Result) => {
    confirm({
      title: '??????????????????',
      icon: <ExclamationCircleFilled />,
      width: 400,
      content: (
        <span style={{ color: 'rgba(23, 26, 29, 0.6)' }}>
          ??????????????????????????????????????????????????????????????????????????????????????????????????????!
        </span>
      ),
      onOk: () => {
        loading.show();
        delRule({ id: d.id, leaveCode: d.vacationTypeRule.leaveCode })
          .then(([success]) => {
            if (success) {
              msg('????????????');
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
      width: 190,
      getHandles: (v: any) => {
        const has_lieu_leave = v.vacationTypeRule.bizType === 'lieu_leave';
        const r = [];
        if (checkAuth(1003)) {
          r.push({
            title: '??????',
            handle: onClick_edit,
          });
        }
        if (checkAuth(1004)) {
          r.push({
            title: '??????',
            handle: onClick_del,
            disabled: has_lieu_leave,
          });
        }
        if (checkAuth(1003)) {
          r.push({
            title: has_lieu_leave ? (
              <Tooltip overlayClassName="leave-unit--tooltip" title={'??????????????????????????????'}>
                <span>??????</span>
              </Tooltip>
            ) : (
              <span>??????</span>
            ),
            handle: onClick_copy,
            disabled: has_lieu_leave,
          });
        }
        return r;
      },
    });
    return [...defaultColumns, actionsReturn];
  };

  return (
    <PageContent className="pg-rules" hasPadding>
      <Header />
      {!inLoading &&
        (!total ? (
          //TODO
          <Empty />
        ) : (
          <>
            <div className="pg-rules--options">
              <Buttons />
            </div>
            <StoreTable name="rule" rowKey="id" withFooterPagination />
          </>
        ))}
      {/*????????????????????????*/}
      {isShowAddPop && <AddRulePop />}
    </PageContent>
  );
};

export default memo(Rules);
