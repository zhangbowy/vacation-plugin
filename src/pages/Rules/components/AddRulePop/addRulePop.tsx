import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { FC } from 'react';
import { useSelector, useDispatch } from 'dva';
import Button from '@/components/buttons/Button';
import Drawer from '@/components/pop/Drawer';
import './index.less';
import Icon from '@/components/Icon/Icon';
import Form from '@/components/form/Form/Form';
import { Item, useForm } from '@/components/form/Form';
import Input from '@/components/form/Input/Input';
import Select from '@/components/form/Select';
import { Group } from '@/components/form/Radio';
import Radio from '@/components/form/Radio/Radio';
import InputNumber from '@/components/form/InputNumber';
import DatePicker from '@/components/form/DatePicker';
import { Space, Switch } from 'antd';
import UserSelect from '@/components/form/UserSelect/UserSelect';
import { addRule, getDetail, editRule } from '@/services/rules';
import { errMsg, msg } from '@/components/pop';
import { __merge } from '@/utils/utils';
import Tooltip from '@/components/pop/Tooltip/Tooltip';
import moment from 'moment';
import QuotaRule from './../QuotaRule';
import { confirm } from '@/components/pop/Modal';
import { Spin } from 'antd';

const RULE_TYPE = [
  {
    value: 'general_leave',
    label: '普通假',
  },
  {
    value: 'lieu_leave',
    label: '调休假',
  },
];

// 适用范围
const APPLICATION_RANGE = [
  {
    value: true,
    label: '全公司',
  },
  {
    value: false,
    label: '部分人员',
  },
];

// 限时提交
const LIMIT_SUBMIT = [
  {
    value: 'none',
    label: '不开启',
  },
  {
    value: 'before',
    label: '需提前',
  },
  {
    value: 'after',
    label: '可补交',
  },
];

// 请假证明
const PROVE = [
  {
    value: false,
    label: '不需要',
  },
  {
    value: true,
    label: '需要',
  },
];

const SEX = [
  {
    value: 0,
    label: '男',
  },
  {
    value: 1,
    label: '女',
  },
];

const DURATION = [
  {
    value: false,
    label: '不限制',
  },
  {
    value: true,
    label: '限制',
  },
];

const TARGET_USER = [
  {
    value: 'probational_normal',
    label: '全部人员',
  },
  {
    value: 'formal',
    label: '正式员工',
  },
  {
    value: 'specific',
    label: '特定人员',
  },
];

const level1Data = [
  {
    value: 'annual',
    label: '每年',
  },
  {
    value: 'month_day',
    label: '每月',
  },
];

const ISSUE_TIME_TYPE = {
  annual: [
    {
      value: 'first_day_year',
      label: '1月1日',
    },
    {
      value: 'staff_entry_day',
      label: '员工入职日',
    },
    {
      value: 'fixed_day',
      label: '固定日期',
    },
  ],
  month_day: [
    {
      value: 'fixed_day',
      label: '固定日期',
      disabled: true,
    },
  ],
};

const AVERAGE_TYPE = [
  {
    value: 'none',
    label: '不按实际工作时长发放余额',
  },
  {
    value: 'average_work_time',
    label: '按上年实际工作时长发放余额',
  },
];

const ROUND_TYPE = [
  {
    value: 'none',
    label: '按实际数值计算',
  },
  {
    value: 'round',
    label: '取小数点后两位四舍五入',
  },
  {
    value: 'ceil',
    label: '向上取整',
  },
  {
    value: 'floor',
    label: '向下取整',
  },
];

const EXPIRE_TYPE = [
  {
    value: 'permanent',
    label: '不过期',
  },
  {
    value: 'fixed_time',
    label: '固定时间段内有效',
  },
  {
    value: 'one_year',
    label: '自发放起一周年',
  },
  {
    value: 'next_month',
    label: '发放日的次月有效',
  },
  {
    value: 'specify_day',
    label: '指定日期有效',
  },
  {
    value: 'until_day',
    label: '截止到固定日期有效',
  },
];

const EXPIRE_WAY = [
  {
    value: 0,
    label: '过期清零',
  },
];

const QUOTA_TYPE = [
  {
    value: 'fixed',
    label: '固定额度',
  },
  // {
  //   value: '222',
  //   label: '按工作地点',
  // },
  {
    value: 'work_age',
    label: '按社会工龄',
  },
  {
    value: 'entry_age',
    label: '按司龄',
  },
  {
    value: 'sum_work_entry_age',
    label: '按社会工龄额度与司龄额度相加',
  },
  {
    value: 'max_work_entry_age',
    label: '按社会工龄额度与司龄额度的较大值',
  },
];

const LEAVE_VIEW_UNIT = [
  {
    value: 'day',
    label: '按天请假',
  },
  {
    value: 'halfDay',
    label: '按0.5天请假',
  },
  {
    value: 'hour',
    label: '按小时请假',
  },
];

const HOUR_CEIL = [
  {
    value: '',
    label: '不取整',
  },
  {
    value: 'down',
    label: '向下取整',
  },
  {
    value: 'up',
    label: '向上取整',
  },
];

const LEAVE_TIME_CEIL_UNIT = [
  {
    value: 'hour',
    label: '按1小时取整',
  },
  {
    value: 'halfHour',
    label: '按半小时取整',
  },
];

const FIXED_UNIT = [
  {
    value: 'day',
    label: '天',
  },
  {
    value: 'month',
    label: '月',
  },
];

const TIME_UNIT = [
  {
    value: 'day',
    label: '天',
  },
  {
    value: 'hour',
    label: '时',
  },
];

const defaultData = {
  whenCanLeave: 'entry', //
  paidLeave: true, // 是否带薪休假
  bizType: 'general_leave', // 假期规则
  APPLICATION_RANGE: 1, // 适用范围
  leaveViewUnit: 'day', //
  leaveTimeCeilMinUnit: 'hour', // 取整方式
  leaveHourCeil: '',
  isLimitDuration: 0, // 是否限制请假时长
  hoursInPerDay: 8, // 每日工时折算,
  naturalDayLeave: true,
  isAllCompany: true, // 是否全员
  submitTimeRule: {
    timeType: 'none',
    timeUnit: 'day',
    timeValue: 1,
  },
  // 请假证明
  leaveCertificate: {
    enable: false,
    promptInformation: '',
    unit: 'day',
    duration: 1,
  },
  // 假期额度配置
  vacationIssueRule: {
    freedomLeave: false, // 开关
    timeRule: {
      issueType: 'annual',
      issueTimeType: 'first_day_year',
      issueDayOfMonth: 1,
      issueDayOfYear: '',
    },
    targetRule: {
      targetType: 'probational_normal',
      sex: 0,
      maxAge: 28,
      minAge: 20,
    },
    expireRule: {
      expireType: 'permanent',
      extendedTime: 0,
      fixedTime: 0,
      specifyDay: '',
      untilDay: '',
      fixedUnit: 'day',
      extendedUnit: 'day',
    },
    quotaRule: {
      quotaType: 'fixed',
      fixedQuota: 0.0,
      averageType: 'none',
      roundType: 'none',
      ageRules: [
        {
          maxAge: 1,
          minAge: 0,
          quota: 1,
          type: 'work_age',
        },
      ],
    },
  },
  // 是否限制最大请假时间
  isLimitLeaveTime: false,
};

const AddRulePop: FC = () => {
  const { isShowAddPop, editInfo, isCopy, hasLieuLeave } = useSelector((state) => ({
    isShowAddPop: state.rules.isShowAddPop,
    editInfo: state.rules.editInfo,
    isCopy: state.rules.isCopy,
    hasLieuLeave: state.rules.editInfo?.isHasLieuLeave,
  }));
  const [form] = useForm();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(__merge({}, defaultData, true));
  const [issueTimeTypeOpts, setIssueTimeTypeOpts] = useState(ISSUE_TIME_TYPE.annual);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isPopLoading, setIsPopLoading] = useState(false);
  const workAgeRef = useRef();
  const entryAgeRef = useRef();

  // 关闭弹窗
  const close = () => {
    confirm({
      title: '提示',
      content: '确定取消吗？',
      onOk: () => {
        dispatch({
          type: 'rules/updateState',
          payload: { isShowAddPop: false, editInfo: null, isCopy: false },
        });
      },
    });
  };

  // 初始化
  const init = (): void => {
    if (editInfo) {
      const { vacationTypeRule, vacationIssueRule } = __merge({}, editInfo, true);
      const editData: any = {
        ...vacationTypeRule,
        hoursInPerDay: vacationTypeRule.hoursInPerDay / 100,
        vacationIssueRule: {
          ...vacationIssueRule,
          expireRule: {
            ...vacationIssueRule.expireRule,
            specifyDay: vacationIssueRule?.expireRule?.specifyDay
              ? moment(vacationIssueRule?.expireRule?.specifyDay)
              : null,
            untilDay: vacationIssueRule?.expireRule?.untilDay
              ? moment(vacationIssueRule.expireRule.untilDay)
              : null,
          },
          timeRule: {
            ...vacationIssueRule.timeRule,
            issueDayOfYear: vacationIssueRule?.timeRule?.issueDayOfYear
              ? moment(vacationIssueRule.timeRule.issueDayOfYear)
              : null,
          },
          freedomLeave: !vacationIssueRule.freedomLeave,
        },
      };

      if (vacationIssueRule?.quotaRule?.ageRules) {
        editData.vacationIssueRule.quotaRule.ageRules = vacationIssueRule.quotaRule.ageRules.map(
          (item) => {
            item.quota = item.quota / 100;
            return item;
          },
        );
      }

      if (vacationIssueRule?.quotaRule?.fixedQuota) {
        editData.vacationIssueRule.quotaRule.fixedQuota =
          vacationIssueRule.quotaRule.fixedQuota / 100;
      }

      if (vacationTypeRule.visibilityRules && vacationTypeRule.visibilityRules.length > 0) {
        const departments = vacationTypeRule.visibilityRules.find(
          (item) => item.type === 'dept',
        ) || { details: [] };
        const users = vacationTypeRule.visibilityRules.find((item) => item.type === 'staff') || {
          details: [],
        };
        editData.chooseUsers = {
          departments: departments?.details,
          users: users?.details.map(({ id, name }) => {
            return {
              emplId: id,
              name,
            };
          }),
        };
      }

      if (
        vacationIssueRule?.quotaRule?.ageRules &&
        vacationIssueRule?.quotaRule?.ageRules.length > 0
      ) {
        if (
          vacationIssueRule?.quotaRule.quotaType == 'max_work_entry_age' ||
          vacationIssueRule?.quotaRule.quotaType == 'sum_work_entry_age'
        ) {
          const ageRules = vacationIssueRule?.quotaRule.ageRules;
          editData.vacationIssueRule.quotaRule.ageRules_two = ageRules.filter(
            (item: any) => item.type === 'entry_age',
          );
          editData.vacationIssueRule.quotaRule.ageRules = ageRules.filter(
            (item: any) => item.type === 'work_age',
          );
        }
      }
      onChange_value({}, editData);
    } else {
      form.setFieldsValue({
        ...formData,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setIsPopLoading(true);
    try {
      if (editInfo?.id) {
        const [, result] = await getDetail({ id: editInfo.id });
        dispatch({
          type: 'rules/updateState',
          payload: { editInfo: result },
        });
      }
      init();
    } catch (e) {}
    setTimeout(() => {
      setIsPopLoading(false);
    }, 300);
  }, [form]);

  const onChange_value = (changedValues: any, allVal: any) => {
    const result = __merge(formData, allVal, true);
    if (changedValues?.vacationIssueRule?.timeRule?.issueType === 'month_day') {
      result.vacationIssueRule.timeRule.issueTimeType = 'fixed_day';
    }
    // 假期类型选了调休假期 假期额度设置默认开启
    if (changedValues.bizType === 'lieu_leave') {
      result.vacationIssueRule.freedomLeave = false;
    }
    if (changedValues?.vacationIssueRule?.quotaRule?.ageRules) {
      result.vacationIssueRule.quotaRule.ageRules =
        changedValues.vacationIssueRule.quotaRule.ageRules;
    }
    if (changedValues?.vacationIssueRule?.quotaRule?.ageRules_two) {
      result.vacationIssueRule.quotaRule.ageRules_two =
        changedValues.vacationIssueRule.quotaRule.ageRules_two;
    }
    if (changedValues?.chooseUsers) {
      result.chooseUsers = changedValues?.chooseUsers;
    }
    if (changedValues?.vacationIssueRule?.timeRule?.issueDayOfYear) {
      result.vacationIssueRule.timeRule.issueDayOfYear =
        changedValues.vacationIssueRule.timeRule.issueDayOfYear;
    }
    // 切换了额度配置类型 司龄和工龄配置为默认1条
    if (changedValues?.vacationIssueRule?.quotaRule?.quotaType) {
      result.vacationIssueRule.quotaRule.ageRules_two = [
        {
          maxAge: 1,
          minAge: 0,
          quota: 1,
          type: 'work_age',
        },
      ];
      result.vacationIssueRule.quotaRule.ageRules = [
        {
          maxAge: 1,
          minAge: 0,
          quota: 1,
          type: 'entry_age',
        },
      ];
    }
    // 额度发放方式选择了月后, 额度配置位置固定额度且置灰
    if (changedValues?.vacationIssueRule?.timeRule?.issueType === 'month_day') {
      result.vacationIssueRule.quotaRule.quotaType = 'fixed';
    }
    // 编辑时候开启了假期，默认数据填充
    if (changedValues?.vacationIssueRule?.freedomLeave == true) {
      result.vacationIssueRule.quotaRule = defaultData.vacationIssueRule.quotaRule;
    }
    // 最小请假单位选择了之后
    if (changedValues?.leaveViewUnit) {
      // 如果是按0。5天请假，最大请假时长默认设置0.5
      if (changedValues?.leaveViewUnit === 'halfDay') {
        result.maxLeaveTime = 0.5;
      } else {
        result.maxLeaveTime = 1;
      }
    }

    form.setFieldsValue({ ...result });
    setFormData({ ...result });
  };

  // 额度发放按年按月的变化回掉 , 设置第二个下拉框的联动
  const onChange_issueType = (val: any) => {
    setIssueTimeTypeOpts(ISSUE_TIME_TYPE[val]);
  };

  const showChooseDay = (): boolean => {
    return !['first_day_year', 'staff_entry_day'].includes(
      formData.vacationIssueRule?.timeRule?.issueTimeType,
    );
  };

  const showCount = useMemo(
    () => ({
      formatter: ({ count, maxLength }: { count: number; maxLength?: number }) => (
        <p>
          <span className="pg-auth--edit--count">{count}</span>
          <span className="pg-auth--edit--max-count">{`/${maxLength}`}</span>
        </p>
      ),
    }),
    [],
  );

  const onClick_save = () => {
    setIsPopLoading(true);
    form
      .validateFields()
      .then((values) => {
        const chooseUsers = values.chooseUsers;
        const { departments, users } = chooseUsers || {};
        const visibilityRules = [];
        if (chooseUsers) {
          if (departments) {
            visibilityRules.push({
              type: 'dept',
              visible: departments ? departments.map(({ id }) => id) : [],
              details: departments.map(({ id, name }) => {
                return {
                  id,
                  name,
                };
              }),
            });
          }
          if (users) {
            visibilityRules.push({
              type: 'staff',
              visible: users ? users.map(({ emplId }) => emplId) : [],
              details: users.map(({ emplId, name }) => {
                return {
                  id: emplId,
                  name,
                };
              }),
            });
          }
        }
        if (!values.isAllCompany) {
          if (visibilityRules.length === 0) {
            return errMsg('适用范围请选择人员');
          }
        }
        const params = {
          vacationTypeRule: {
            leaveName: values.leaveName, // 假期规则名称
            bizType: values.bizType, // 假期规则
            whenCanLeave: values.whenCanLeave, // 新员工请假 entry：入职可使用 formal：转正可使用
            paidLeave: values.paidLeave, // 是否带薪休假
            // submitTimeRule: values.submitTimeRule, // 限时提交
            submitTimeRule: {
              ...values.submitTimeRule,
              enableTimeLimit: values.submitTimeRule.timeType == 'none' ? false : true,
            },
            leaveCertificate: values.leaveCertificate, // 请假时提交证明
            leaveViewUnit: values.leaveViewUnit, // 请假时长单位
            naturalDayLeave: values.naturalDayLeave, // 请请假时长核算,是否按照自然日统计请假时长
            hoursInPerDay: values.hoursInPerDay * 100, // 每日工时折算,
            maxLeaveTime: '', // 最大请假时间
            isLimitLeaveTime: values.isLimitLeaveTime, // 是否限制最大请假时间
            visibilityRules: visibilityRules, // 适用范围，如果是“全员”此参数不传
            isAllCompany: values.isAllCompany, // 是否全公司
          },
          vacationIssueRule: {
            ...values.vacationIssueRule,
            expireRule: {
              ...values.vacationIssueRule?.expireRule,
              isExtended: true,
            },
            quotaRule: {
              ...values.vacationIssueRule?.quotaRule,
              fixedQuota: values.vacationIssueRule?.quotaRule?.fixedQuota * 100 || 0,
            },
            freedomLeave: !values.vacationIssueRule.freedomLeave, // 开关
          }, // 假期额度设置
        };

        // 如果开启了限制单次最大请假时间
        if (values.isLimitLeaveTime) {
          params.vacationTypeRule.maxLeaveTime = values.maxLeaveTime;
        }
        // 请假最小单位如果是小时
        if (values.leaveViewUnit === 'hour') {
          params.vacationTypeRule.leaveHourCeil = values.leaveHourCeil; // 设置取整类型
          params.vacationTypeRule.leaveTimeCeilMinUnit = values.leaveTimeCeilMinUnit; // 设置取整大小
        }
        if (values.vacationIssueRule?.quotaRule?.ageRules_two) {
          params.vacationIssueRule.quotaRule.ageRules =
            values.vacationIssueRule.quotaRule.ageRules.concat(
              values.vacationIssueRule.quotaRule.ageRules_two,
            );
          delete params.vacationIssueRule.quotaRule.ageRules_two;
        }
        if (values.vacationIssueRule?.quotaRule?.ageRules) {
          params.vacationIssueRule.quotaRule.ageRules =
            values.vacationIssueRule.quotaRule.ageRules.map((item) => {
              item.quota = item.quota * 100;
              return item;
            });
        }
        // 过期时间特别的一天时间格式化
        if (values.vacationIssueRule?.expireRule?.specifyDay) {
          params.vacationIssueRule.expireRule.specifyDay = moment(
            values.vacationIssueRule.expireRule.specifyDay,
          ).format('MM-DD');
        }
        // 截止某一天
        if (values.vacationIssueRule?.expireRule?.untilDay) {
          params.vacationIssueRule.expireRule.untilDay = moment(
            values.vacationIssueRule.expireRule.untilDay,
          ).format('yyyy-MM-DD');
        }
        // 发放日期
        if (values.vacationIssueRule?.timeRule?.issueDayOfYear) {
          params.vacationIssueRule.timeRule.issueDayOfYear = moment(
            values.vacationIssueRule.timeRule.issueDayOfYear,
          ).format('MM-DD');
        }

        let api = addRule;
        // 编辑的时候多增加的信息
        if (editInfo && !isCopy) {
          params.id = editInfo.id;
          params.companyId = editInfo.companyId;
          params.corpId = editInfo.corpId;
          params.vacationTypeRule.leaveCode = editInfo.vacationTypeRule.leaveCode;
          api = editRule;
        }
        // api
        api(params).then(([success, result]) => {
          const text = editInfo && !isCopy ? '编辑' : '添加';
          if (success) {
            dispatch({
              type: 'rules/updateState',
              payload: { isShowAddPop: false, editInfo: null, isCopy: false },
            });
            dispatch({ type: 'table/refreshTable' });
            msg(`规则${text}成功`);
          }
        });
      })
      .catch((e) => {
        const { errorFields = [] } = e;
        if (errorFields[0] && errorFields[0].errors) {
          const errors = errorFields[0].errors || [];
          errMsg(errors[0] || '参数错误，请检查');
        } else {
          errMsg(e);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsPopLoading(false);
        }, 300);
      });
  };

  return (
    <Drawer
      title=""
      placement="right"
      width="600"
      closable={false}
      className="add-rule-wrap"
      visible={isShowAddPop}
      onClose={() => {
        close();
      }}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button
            className={'cancel-btn'}
            onClick={() => {
              close();
            }}
            style={{ marginRight: 8 }}
          >
            取消
          </Button>
          <Button
            className={'save-btn'}
            loading={isShowLoading}
            onClick={onClick_save}
            type="primary"
          >
            保存
          </Button>
        </div>
      }
    >
      {/*抽屉的自定义头*/}
      <div className="customer_header">
        <div className="title_box">
          <div className={'customer_title'}>{editInfo && !isCopy ? '编辑' : '添加'}假期规则</div>
          {
            <Icon
              type="icon-guanbi"
              className={'close_icon'}
              onClick={() => {
                close();
              }}
            />
          }
        </div>
      </div>
      <Spin spinning={isPopLoading}>
        <div className="customer_body">
          <Form layout="vertical" onValuesChange={onChange_value} form={form}>
            {/*基本信息*/}
            <div className="base_info">
              <div className="title">基本信息</div>
              <Item
                label="假期规则名称"
                name="leaveName"
                rules={[{ required: true, message: '请输入规则名称' }]}
              >
                <Input placeholder="请输入规则名称" showCount={showCount} maxLength={64} />
              </Item>
              <Item
                label="假期规则类型"
                name="bizType"
                className="w-120"
                rules={[{ required: true, message: '请选择' }]}
              >
                <Select onChange={() => {}} disabled={hasLieuLeave} options={RULE_TYPE} />
              </Item>
              <Item label="新员工请假" name="whenCanLeave">
                <Group>
                  <Space direction="vertical">
                    <Radio value={'entry'}>入职可使用</Radio>
                    <Radio value={'formal'}>转正可使用</Radio>
                  </Space>
                </Group>
              </Item>
              <Item label="规则适用范围" style={{ marginBottom: 0 }}>
                <Item
                  label=""
                  style={{ display: 'inline-block' }}
                  className="w-120"
                  name="isAllCompany"
                  rules={[{ required: true, message: '请选择' }]}
                >
                  <Select onChange={(e) => {}} options={APPLICATION_RANGE} />
                </Item>
                {!formData.isAllCompany && (
                  <Item
                    label=""
                    style={{ display: 'inline-block', width: 270, margin: '0 8px' }}
                    name="chooseUsers"
                  >
                    <UserSelect
                      placeholder="请选择"
                      responseUserOnly={false}
                      className={'app_range_user_select'}
                    />
                  </Item>
                )}
              </Item>
              <Item label="是否带薪" name="paidLeave">
                <Group>
                  <Space direction="vertical">
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Space>
                </Group>
              </Item>
              <Item
                rules={[{ required: true, message: '' }]}
                label="限时提交"
                style={{ marginBottom: 0 }}
              >
                <Item
                  label=""
                  style={{ display: 'inline-block' }}
                  className="w-120 m-r-8"
                  name={['submitTimeRule', 'timeType']}
                >
                  <Select onChange={() => {}} options={LIMIT_SUBMIT} />
                </Item>
                {formData.submitTimeRule.timeType === 'before' && (
                  <>
                    <Item
                      label=""
                      style={{ display: 'inline-block' }}
                      className="hours-InPerDay-input"
                      name={['submitTimeRule', 'timeValue']}
                      rules={[{ required: true, message: '请填写天数' }]}
                    >
                      <InputNumber min={1} max={24} onChange={() => {}} />
                    </Item>
                    <Item
                      label=""
                      name={['submitTimeRule', 'timeUnit']}
                      className="w-80 m-l-8 inline"
                      rules={[{ required: true, message: '请选择天或小时' }]}
                    >
                      <Select options={TIME_UNIT} />
                    </Item>
                    <span className="hour-text">提交请假申请</span>
                  </>
                )}
                {formData.submitTimeRule.timeType === 'after' && (
                  <>
                    <Item
                      label=""
                      style={{ display: 'inline-block' }}
                      className="hours-InPerDay-input"
                      name={['submitTimeRule', 'timeValue']}
                      rules={[{ required: true, message: '请填写天数' }]}
                    >
                      <InputNumber min={1} onChange={() => {}} />
                    </Item>
                    <Item
                      label=""
                      name={['submitTimeRule', 'timeUnit']}
                      className="w-80 m-l-8 inline"
                      rules={[{ required: true, message: '请选择天或小时' }]}
                    >
                      <Select options={TIME_UNIT} />
                    </Item>
                    <span className="hour-text">之内的请假申请</span>
                  </>
                )}
              </Item>
              <Item label="员工请假时提交证明" name="leaveCertificate" style={{ marginBottom: 0 }}>
                <Item label="" className="w-120 inline" name={['leaveCertificate', 'enable']}>
                  <Select onChange={() => {}} options={PROVE} />
                </Item>
                {formData.leaveCertificate.enable && (
                  <Item
                    label=""
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                    name={['leaveCertificate', 'promptInformation']}
                    rules={[{ required: true, message: '请输入提示语' }]}
                  >
                    <Input onChange={() => {}} placeholder={'请输入提示语'} />
                  </Item>
                )}
              </Item>
            </div>
            <div className="base_info">
              <div className="title">时长核算规则</div>
              <Item label="最小请假单位" style={{ marginBottom: 0 }}>
                <Item
                  label=""
                  name="leaveViewUnit"
                  className="w-120 inline"
                  rules={[{ required: true, message: '请选择' }]}
                >
                  <Select options={LEAVE_VIEW_UNIT} />
                </Item>
                {formData.leaveViewUnit === 'hour' && (
                  <>
                    <span className="hour-text m-l-8">，时长</span>
                    <Item label="" name="leaveHourCeil" className="w-120 m-l-8 inline">
                      <Select options={HOUR_CEIL} />
                    </Item>
                    {formData.leaveHourCeil && (
                      <>
                        <Item label="" name="leaveTimeCeilMinUnit" className="w-120 m-l-8 inline">
                          <Select options={LEAVE_TIME_CEIL_UNIT} />
                        </Item>
                        <span className="leave-unit-tips m-l-8">
                          <Tooltip
                            overlayClassName="leave-unit--tooltip"
                            title={
                              <div>
                                <p>向上取整：</p>
                                <p>
                                  按1小时取整：抹掉小数，整数+1；按半小时取整：小数点后1位大于0.5，则抹掉小数，整数+1；小数点后一位小于0.5，则小数点计为0.5
                                </p>
                                <p>向下取整</p>
                                <p>
                                  按1小时取整：抹掉小数，整数不变；按半小时取整：小数点后1位大于0.5，则小数点计为0.5；小数点后一位小于0.5，则抹去小数，整数不变
                                </p>
                              </div>
                            }
                          >
                            <Icon type="icon-tishi" className={'close_icon'} />
                          </Tooltip>
                        </span>
                      </>
                    )}
                  </>
                )}
              </Item>
              <Item label="请假时长核算" name="naturalDayLeave">
                <Group>
                  <Space direction="vertical">
                    <Radio value={false}>按照工作日计算时长</Radio>
                    <Radio value={true}>按照自然日计算时长</Radio>
                  </Space>
                </Group>
              </Item>
              <Item label="工时折算" style={{ marginBottom: 0 }}>
                <span className="hours-InPerDay">1天工时折合</span>
                <Item label="" className="hours-InPerDay-input inline" name="hoursInPerDay">
                  <InputNumber min={1} max={24} onChange={() => {}} />
                </Item>
                <span className="hour-text">小时</span>
              </Item>
              <Item label="单次请假时长" style={{ marginBottom: 0 }}>
                <Item className="w-120 m-r-8 inline" label="" name="isLimitLeaveTime">
                  <Select onChange={() => {}} options={DURATION} />
                </Item>

                {formData.isLimitLeaveTime && (
                  <>
                    <span className="hours-InPerDay">单次请假不能超过</span>
                    <Item label="" className="hours-InPerDay-input inline" name="maxLeaveTime">
                      <InputNumber
                        min={formData.leaveViewUnit === 'halfDay' ? 0.5 : 1}
                        step={formData.leaveViewUnit === 'halfDay' ? 0.5 : 1}
                        max={24}
                        onChange={() => {}}
                      />
                    </Item>
                    <span className="hour-text">
                      {formData.leaveViewUnit === 'hour' ? '小时' : '天'}
                    </span>
                  </>
                )}
              </Item>
            </div>
            <div className="base_info">
              <div
                className="time-rule-title-wrap"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <div className="title">假期额度设置</div>
                <Tooltip
                  overlayClassName="leave-unit--tooltip"
                  title={'开启后，可设置假期额度，例如年假每年5天；关闭则不限制假期额度。'}
                >
                  <Icon type="icon-tishi" className={'tips'} />
                </Tooltip>
                <Item
                  style={{
                    display: 'inline-block',
                    width: 100,
                    height: 32,
                    margin: '0 8px',
                  }}
                  label=""
                  name={['vacationIssueRule', 'freedomLeave']}
                >
                  <Switch
                    disabled={formData.bizType === 'lieu_leave' || (editInfo?.id && !isCopy)}
                    checked={formData.vacationIssueRule.freedomLeave}
                  />
                </Item>
              </div>
              {formData.vacationIssueRule.freedomLeave && (
                <div>
                  <Item label="额度发放方式" style={{ marginBottom: 0 }}>
                    <Item
                      label=""
                      className="w-120 m-r-8 inline"
                      name={['vacationIssueRule', 'timeRule', 'issueType']}
                    >
                      <Select onChange={onChange_issueType} options={level1Data} />
                    </Item>
                    <Item
                      label=""
                      className="w-120 m-r-8 inline"
                      name={['vacationIssueRule', 'timeRule', 'issueTimeType']}
                    >
                      <Select
                        disabled={formData.vacationIssueRule?.timeRule?.issueType === 'month_day'}
                        options={issueTimeTypeOpts}
                      />
                    </Item>
                    {showChooseDay() &&
                      formData.vacationIssueRule?.timeRule?.issueType === 'month_day' && (
                        <Item
                          label=""
                          className="issueDayOfMonth m-r-8 inline"
                          name={['vacationIssueRule', 'timeRule', 'issueDayOfMonth']}
                        >
                          <InputNumber min={1} max={28} />
                        </Item>
                      )}
                    {showChooseDay() &&
                      formData.vacationIssueRule?.timeRule?.issueType === 'annual' && (
                        <Item
                          label=""
                          className="w-120 m-r-8 inline"
                          name={['vacationIssueRule', 'timeRule', 'issueDayOfYear']}
                          rules={[{ required: true, message: '请选择日期' }]}
                        >
                          <DatePicker format={'MM-DD'} />
                        </Item>
                      )}
                    <span className="hour-text">
                      {formData.vacationIssueRule?.timeRule?.issueType === 'month_day' ? '号' : ''}
                      自动发放
                    </span>
                  </Item>
                  <Item label="额度发放人员" style={{ marginBottom: 0 }}>
                    <Item
                      label=""
                      className="w-120 inline"
                      name={['vacationIssueRule', 'targetRule', 'targetType']}
                    >
                      <Select options={TARGET_USER} />
                    </Item>
                    {formData.vacationIssueRule?.targetRule &&
                      formData.vacationIssueRule.targetRule.targetType === 'specific' && (
                        <div className="target-rule">
                          <span className="hours-InPerDay">性别为</span>
                          <Item
                            label=""
                            style={{ display: 'inline-block', width: 80, marginRight: 8 }}
                            name={['vacationIssueRule', 'targetRule', 'sex']}
                            rules={[{ required: true, message: '请选择性别' }]}
                          >
                            <Select options={SEX} />
                          </Item>
                          年龄在
                          <Item
                            label=""
                            style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                            name={['vacationIssueRule', 'targetRule', 'minAge']}
                            rules={[{ required: true, message: '' }]}
                          >
                            <InputNumber
                              min={0}
                              max={
                                formData.vacationIssueRule.targetRule.maxAge
                                  ? formData.vacationIssueRule.targetRule.maxAge - 1
                                  : 99
                              }
                            />
                          </Item>
                          <span>-</span>
                          <Item
                            label=""
                            style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                            name={['vacationIssueRule', 'targetRule', 'maxAge']}
                            rules={[{ required: true, message: '' }]}
                          >
                            <InputNumber
                              min={
                                formData.vacationIssueRule.targetRule.minAge
                                  ? formData.vacationIssueRule.targetRule.minAge + 1
                                  : 1
                              }
                            />
                          </Item>
                        </div>
                      )}
                  </Item>
                  <div className={'quota-rule'}>
                    <Item
                      label={
                        <div>
                          <span>额度配置</span>
                          <Tooltip title={'未配置或不符合条件则额度为0'}>
                            <Icon type="icon-tishi" className={'tips'} />
                          </Tooltip>
                        </div>
                      }
                      style={{ marginBottom: 0 }}
                    >
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: 320, marginBottom: 0 }}
                        className=" m-r-8"
                        name={['vacationIssueRule', 'quotaRule', 'quotaType']}
                      >
                        <Select
                          disabled={formData.vacationIssueRule.timeRule.issueType != 'annual'}
                          options={QUOTA_TYPE}
                        />
                      </Item>
                      {/*额度配置 - 固定额度*/}
                      {formData.vacationIssueRule.quotaRule?.quotaType === 'fixed' && (
                        <>
                          <span className="hour-text m-r-8">发放</span>
                          <Item
                            label=""
                            style={{ display: 'inline-block' }}
                            className="expireRule"
                            name={['vacationIssueRule', 'quotaRule', 'fixedQuota']}
                          >
                            <InputNumber step="0.01" />
                          </Item>
                          <span className="hour-text m-l-8">天</span>
                        </>
                      )}
                      {/*额度配置 - 按社会工龄*/}
                      {formData.vacationIssueRule.quotaRule?.quotaType === 'work_age' && (
                        <>
                          <span
                            className="add-rule-btn"
                            onClick={() => {
                              workAgeRef.current.add();
                            }}
                          >
                            添加规则
                          </span>
                          <Item
                            label=""
                            style={{ display: 'block' }}
                            className="w-120"
                            name={['vacationIssueRule', 'quotaRule', 'ageRules']}
                          >
                            <QuotaRule cRef={workAgeRef} type={'work_age'} />
                          </Item>
                        </>
                      )}
                      {/*额度配置 - 按社会工龄*/}
                      {formData.vacationIssueRule.quotaRule?.quotaType === 'entry_age' && (
                        <>
                          <span
                            className="add-rule-btn"
                            onClick={() => {
                              workAgeRef.current.add();
                            }}
                          >
                            添加规则
                          </span>
                          <Item
                            label=""
                            style={{ display: 'block' }}
                            className="w-120"
                            name={['vacationIssueRule', 'quotaRule', 'ageRules']}
                          >
                            <QuotaRule cRef={workAgeRef} type={'entry_age'} />
                          </Item>
                        </>
                      )}
                      {/*额度配置 - 按照工龄、司龄相加*/}
                      {(formData.vacationIssueRule.quotaRule?.quotaType === 'sum_work_entry_age' ||
                        formData.vacationIssueRule.quotaRule?.quotaType ===
                          'max_work_entry_age') && (
                        <>
                          <div className={'sum_work_entry_age'}>
                            <div className={'top-wrap'}>
                              <span className={'sub-title'}>社会工龄配额</span>
                              <span
                                className="add-rule-btn"
                                onClick={() => {
                                  workAgeRef.current.add();
                                }}
                              >
                                添加规则
                              </span>
                            </div>
                            <Item
                              label=""
                              style={{ display: 'block', marginBottom: 0 }}
                              className="w-120"
                              name={['vacationIssueRule', 'quotaRule', 'ageRules']}
                            >
                              <QuotaRule cRef={workAgeRef} type={'work_age'} />
                            </Item>
                          </div>
                          <div className={'sum_work_entry_age'}>
                            <div className={'top-wrap'}>
                              <span className={'sub-title'}>司龄配额</span>
                              <span
                                className="add-rule-btn"
                                onClick={() => {
                                  entryAgeRef.current.add();
                                }}
                              >
                                添加规则
                              </span>
                            </div>
                            <Item
                              label=""
                              style={{ display: 'block', marginBottom: 0 }}
                              className="w-120"
                              name={['vacationIssueRule', 'quotaRule', 'ageRules_two']}
                            >
                              <QuotaRule cRef={entryAgeRef} type={'entry_age'} />
                            </Item>
                          </div>
                        </>
                      )}
                    </Item>
                  </div>

                  {formData.vacationIssueRule.timeRule.issueType === 'annual' && (
                    <>
                      <Item label="额度计算方式" style={{}}>
                        <Item
                          label=""
                          style={{ marginBottom: 0, display: 'inline-block', width: '100%' }}
                          name={['vacationIssueRule', 'quotaRule', 'averageType']}
                          rules={[{ required: true, message: '请选择额度计算方式' }]}
                        >
                          <Select options={AVERAGE_TYPE} />
                        </Item>
                        {formData.vacationIssueRule.quotaRule.averageType ===
                          'average_work_time' && (
                          <p className="average-type-tip">额度=上年在职天数/365*对应假期额度</p>
                        )}
                      </Item>
                    </>
                  )}
                  {formData.vacationIssueRule.timeRule.issueType === 'annual' && (
                    <Item label="额度取整" style={{ marginBottom: 0 }}>
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: '100%' }}
                        name={['vacationIssueRule', 'quotaRule', 'roundType']}
                        rules={[{ required: true, message: '请选择额度取整方式' }]}
                      >
                        <Select options={ROUND_TYPE} />
                      </Item>
                    </Item>
                  )}
                  <Item label="额度有效期" style={{ marginBottom: 0 }}>
                    <Item
                      label=""
                      style={{ display: 'inline-block', width: 200 }}
                      className="m-r-8"
                      name={['vacationIssueRule', 'expireRule', 'expireType']}
                    >
                      <Select options={EXPIRE_TYPE} />
                    </Item>
                    {/*固定时间段*/}
                    {formData.vacationIssueRule.expireRule?.expireType === 'fixed_time' && (
                      <>
                        <span className="hour-text m-r-8">自发起日起</span>
                        <Item
                          label=""
                          className="inline"
                          name={['vacationIssueRule', 'expireRule', 'fixedTime']}
                        >
                          <InputNumber min={0} />
                        </Item>
                        <Item
                          label=""
                          name={['vacationIssueRule', 'expireRule', 'fixedUnit']}
                          className="w-80 m-l-8 inline"
                          rules={[{ required: true, message: '请选择天或月' }]}
                        >
                          <Select options={FIXED_UNIT} />
                        </Item>
                        <span className="hour-text m-l-8">有效</span>
                      </>
                    )}
                    {/*指定某天*/}
                    {formData.vacationIssueRule.expireRule?.expireType === 'specify_day' && (
                      <Item
                        label=""
                        className="inline"
                        name={['vacationIssueRule', 'expireRule', 'specifyDay']}
                        rules={[{ required: true, message: '请选择日期' }]}
                      >
                        <DatePicker format={'MM-DD'} />
                      </Item>
                    )}
                    {/*直到某天*/}
                    {formData.vacationIssueRule.expireRule?.expireType === 'until_day' && (
                      <Item
                        label=""
                        className="inline"
                        name={['vacationIssueRule', 'expireRule', 'untilDay']}
                        rules={[{ required: true, message: '请选择日期' }]}
                      >
                        <DatePicker />
                      </Item>
                    )}
                  </Item>
                  {/*假期不过期，就没有有效期延长*/}
                  {formData.vacationIssueRule.expireRule?.expireType !== 'permanent' && (
                    <Item label="有效期可以延长" style={{ marginBottom: 0 }}>
                      <Item
                        label=""
                        className="expireRule m-l-8 inline"
                        name={['vacationIssueRule', 'expireRule', 'extendedTime']}
                      >
                        <InputNumber min={0} defaultValue={0} />
                      </Item>
                      <Item
                        label=""
                        name={['vacationIssueRule', 'expireRule', 'extendedUnit']}
                        className="expireRule w-80 m-l-8 inline"
                        rules={[{ required: true, message: '请选择天或月' }]}
                      >
                        <Select options={FIXED_UNIT} />
                      </Item>
                      {/*<span className="hour-text m-l-8">天</span>*/}
                    </Item>
                  )}
                  {formData.vacationIssueRule.timeRule.issueType === 'annual' && (
                    <Item label="过期处理方式" style={{ marginBottom: 0 }}>
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: '100%' }}
                        name={['vacationIssueRule', 'expireRule', 'expiredWay']}
                      >
                        <Select disabled options={EXPIRE_WAY} defaultValue={0} />
                      </Item>
                    </Item>
                  )}
                </div>
              )}
            </div>
          </Form>
        </div>
      </Spin>
    </Drawer>
  );
};
export default AddRulePop;
