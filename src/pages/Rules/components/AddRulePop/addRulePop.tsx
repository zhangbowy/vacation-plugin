import React, { useEffect, useState } from 'react';
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
import RangePicker from '@/components/form/RangePicker';
import { Space, Switch } from 'antd';
import UserSelect from '@/components/form/UserSelect/UserSelect';
import { addRule, editRule } from '@/services/rules';
import { errMsg, msg } from '@/components/pop';
import { __merge } from '@/utils/utils';
import Tooltip from '@/components/pop/Tooltip/Tooltip';
import loading from '@/components/pop/loading';
import moment from 'moment';
import QuotaRule from './../QuotaRule';

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
    value: 1,
    label: '全公司',
  },
  {
    value: 2,
    label: '部分人员',
  },
];

// 限时提交
const LIMIT_SUBMIT = [
  {
    value: 'none',
    label: '不限时',
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
const IssueTimeTypeMap = {
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

const averageTypeMap = [
  {
    value: 'none',
    label: '不按实际工作时长发放余额',
  },
  {
    value: 'average_work_time',
    label: '按上年实际工作时长发放余额',
  },
];

const roundTypeMap = [
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

const expireTypeMap = [
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

const expiredMap = [
  {
    value: 0,
    label: '过期清零',
  },
];

const quotaTypeMap = [
  {
    value: 'fixed',
    label: '固定额度',
  },
  {
    value: '222',
    label: '按工作地点',
  },
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

const leaveViewUnit = [
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

const HourCeil = [
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

const leaveTimeCeilMinUnit = [
  {
    value: 'hour',
    label: '按1小时取整',
  },
  {
    value: 'halfHour',
    label: '按半小时取整',
  },
];

const AddRulePop: FC = () => {
  const { isShowAddPop, editInfo } = useSelector((state) => ({
    isShowAddPop: state.rules.isShowAddPop,
    editInfo: state.rules.editInfo,
  }));
  const [form] = useForm();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
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
    submitTimeRule: {
      timeType: 'none',
      timeUnit: 'day',
      timeValue: 0,
    },
    // 请假证明
    leaveCertificate: {
      enable: 0,
      promptInformation: '',
      unit: 'day',
      duration: 0,
    },
    // 假期额度配置
    vacationIssueRule: {
      freedomLeave: false, // 开关
      timeRule: {
        issueType: 'annual',
        issueTimeType: 'first_day_year',
        issueDayOfMonth: 0,
        issueDayOfYear: '',
      },
      targetRule: {
        targetType: 'probational_normal',
        sex: 0,
        maxAge: 0,
        minAge: 0,
      },
      expireRule: {
        expireType: 'permanent',
        extendedTime: 0,
        fixedTime: 0,
      },
      quotaRule: {
        quotaType: 'fixed',
        fixedQuota: 0.0,
        averageType: 'none',
        roundType: 'none',
      },
    },
    // 是否限制最大请假时间
    isLimitLeaveTime: false,
  });
  const [issueTimeTypeOpts, setIssueTimeTypeOpts] = useState(IssueTimeTypeMap.annual);
  const [isShowLoading, setIsShowLoading] = useState(false);

  // 关init闭弹窗
  const close = () => {
    dispatch({
      type: 'rules/updateState',
      payload: { isShowAddPop: false, editInfo: null },
    });
  };

  // 初始化
  const init = () => {
    if (editInfo) {
      const { vacationTypeRule, vacationIssueRule } = editInfo;
      const editData = {
        ...vacationTypeRule,
        APPLICATION_RANGE: vacationTypeRule.visibilityRules.length === 0 ? 1 : 2, // 适用范围
        hoursInPerDay: vacationTypeRule.hoursInPerDay / 100,
        vacationIssueRule: {
          ...vacationIssueRule,
          expireRule: {
            ...vacationIssueRule.expireRule,
            specifyDay: moment(vacationIssueRule.expireRule.specifyDay),
            untilDay: vacationIssueRule.expireRule.untilDay
              ? moment(vacationIssueRule.expireRule.untilDay)
              : null,
          },
          freedomLeave: !vacationIssueRule.freedomLeave,
        },
      };

      if (vacationTypeRule.visibilityRules && vacationTypeRule.visibilityRules.length > 0) {
        // const departments = vacationTypeRule.visibilityRules.find((item) => item.type === 'dept');
        // const users = vacationTypeRule.visibilityRules.find((item) => item.type === 'staff');
      }
      console.log(editData);
      onChange_value({}, editData);
      form.setFieldsValue(editData);
    } else {
      form.setFieldsValue({
        ...formData,
      });
    }
  };

  useEffect(() => {
    init();
  }, [form]);

  const onChange_value = (changedValues: any, allVal: any) => {
    console.log(allVal);
    const result = __merge(formData, allVal, true);
    if (changedValues?.vacationIssueRule?.timeRule?.issueType === 'month_day') {
      result.vacationIssueRule.timeRule.issueTimeType = 'fixed_day';
      form.setFieldsValue({
        vacationIssueRule: {
          timeRule: {
            issueTimeType: 'fixed_day',
          },
        },
      });
    }
    if (changedValues.bizType === 'lieu_leave') {
      result.vacationIssueRule.freedomLeave = false;
      form.setFieldsValue({
        vacationIssueRule: {
          freedomLeave: false,
        },
      });
    }
    console.log(result);
    setFormData({ ...result });
  };

  // 额度发放按年按月的变化回掉
  const onChange_issueType = (val: any) => {
    setIssueTimeTypeOpts(IssueTimeTypeMap[val]);
    form.getFieldValue('vacationIssueRule');
  };

  const showChooseDay = (): boolean => {
    return !['first_day_year', 'staff_entry_day'].includes(
      formData.vacationIssueRule?.timeRule?.issueTimeType,
    );
  };

  const onClick_save = () => {
    loading.show();
    setIsShowLoading(true);
    form
      .validateFields()
      .then((values) => {
        console.log(values);
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
              details: departments.map(({ id, name }) => {
                return {
                  id,
                  name,
                };
              }),
            });
          }
        }

        const params = {
          vacationTypeRule: {
            leaveName: values.leaveName, // 假期规则名称
            bizType: values.bizType, // 假期规则
            whenCanLeave: values.whenCanLeave, // 新员工请假 entry：入职可使用 formal：转正可使用
            // APPLICATION_RANGE: 1, // 适用范围
            paidLeave: values.paidLeave, // 是否带薪休假
            submitTimeRule: values.submitTimeRule,
            leaveCertificate: values.leaveCertificate, // 请假时提交证明
            leaveViewUnit: values.leaveViewUnit, // 请假时长单位
            naturalDayLeave: values.naturalDayLeave, // 请请假时长核算,是否按照自然日统计请假时长
            hoursInPerDay: values.hoursInPerDay * 100, // 每日工时折算,
            maxLeaveTime: '', // 最大请假时间
            isLimitLeaveTime: values.isLimitLeaveTime, // 是否限制最大请假时间
            visibilityRules: visibilityRules, // 适用范围，如果是“全员”此参数不传
          },
          vacationIssueRule: {
            ...values.vacationIssueRule,
            freedomLeave: !values.vacationIssueRule.freedomLeave,
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
        // 编辑的时候多增加的信息
        if (editInfo) {
          params.id = editInfo.id;
          params.companyId = editInfo.companyId;
          params.corpId = editInfo.corpId;
          params.vacationTypeRule.leaveCode = editInfo.vacationTypeRule.leaveCode;
        }

        // api
        const api = editInfo ? editRule : addRule;
        api(params).then(([success, result]) => {
          const text = editInfo ? '编辑' : '添加';
          if (success) {
            close();
            msg(`规则${text}成功`);
            dispatch({ type: 'table/refreshTable' });
          } else {
            errMsg(`${text}失败, 请重试`);
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
        loading.hide();
        setIsShowLoading(false);
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
          <div className={'customer_title'}>{editInfo ? '编辑' : '添加'}假期规则</div>
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
              <Input placeholder="请输入规则名称" showCount={true} maxLength={30} />
            </Item>
            <Item
              label="假期规则类型"
              name="bizType"
              className="w-120"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select onChange={() => {}} options={RULE_TYPE} />
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
                name="APPLICATION_RANGE"
              >
                <Select onChange={(e) => {}} options={APPLICATION_RANGE} />
              </Item>
              {formData.APPLICATION_RANGE === 2 && (
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
            <Item label="限时提交" style={{ marginBottom: 0 }}>
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
                  >
                    <InputNumber min={1} max={24} onChange={() => {}} />
                  </Item>
                  <span className="hour-text">天之内的请假申请</span>
                </>
              )}
              {formData.submitTimeRule.timeType === 'after' && (
                <>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    className="hours-InPerDay-input"
                    name={['submitTimeRule', 'timeValue']}
                  >
                    <InputNumber min={1} onChange={() => {}} />
                  </Item>
                  <span className="hour-text">天提交请假申请</span>
                </>
              )}
            </Item>
            <Item label="员工请假时提交证明" name="leaveCertificate" style={{ marginBottom: 0 }}>
              <Item
                label=""
                style={{ display: 'inline-block' }}
                className="w-120"
                name={['leaveCertificate', 'enable']}
              >
                <Select onChange={() => {}} options={PROVE} />
              </Item>
              {formData.leaveCertificate.enable === 1 && (
                <Item
                  label=""
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                  name={['leaveCertificate', 'promptInformation']}
                  rules={[{ required: true, message: '请输入' }]}
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
                <Select options={leaveViewUnit} />
              </Item>
              {formData.leaveViewUnit === 'hour' && (
                <>
                  <span className="hour-text m-l-8">，时长</span>
                  <Item label="" name="leaveHourCeil" className="w-120 m-l-8 inline">
                    <Select options={HourCeil} />
                  </Item>
                  <Item label="" name="leaveTimeCeilMinUnit" className="w-120 m-l-8 inline">
                    <Select options={leaveTimeCeilMinUnit} />
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
              <Item
                label=""
                style={{ display: 'inline-block' }}
                className="hours-InPerDay-input"
                name="hoursInPerDay"
              >
                <InputNumber min={1} max={24} onChange={() => {}} />
              </Item>
              <span className="hour-text">小时</span>
            </Item>
            <Item label="单次请假时长" style={{ marginBottom: 0 }}>
              <Item
                style={{ display: 'inline-block' }}
                className="w-120 m-r-8"
                label=""
                name="isLimitLeaveTime"
              >
                <Select onChange={() => {}} options={DURATION} />
              </Item>

              {formData.isLimitLeaveTime && (
                <>
                  <span className="hours-InPerDay">单次请假不能超过</span>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    className="hours-InPerDay-input"
                    name="maxLeaveTime"
                  >
                    <InputNumber min={1} max={24} onChange={() => {}} />
                  </Item>
                  <span className="hour-text">天</span>
                </>
              )}
            </Item>
          </div>
          <div className="base_info">
            <div className="title-wrap" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="title">假期额度设置</div>
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
                  disabled={formData.bizType === 'lieu_leave'}
                  checked={formData.vacationIssueRule.freedomLeave}
                />
              </Item>
            </div>
            {formData.vacationIssueRule.freedomLeave && (
              <div>
                <Item label="额度发放方式" style={{ marginBottom: 0 }}>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    className="w-120 m-r-8"
                    name={['vacationIssueRule', 'timeRule', 'issueType']}
                  >
                    <Select onChange={onChange_issueType} options={level1Data} />
                  </Item>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    className="w-120 m-r-8"
                    name={['vacationIssueRule', 'timeRule', 'issueTimeType']}
                  >
                    <Select
                      disabled={formData.vacationIssueRule?.timeRule?.issueType === 'month_day'}
                      onChange={(e) => {}}
                      options={issueTimeTypeOpts}
                    />
                  </Item>
                  {showChooseDay() && (
                    <Item
                      label=""
                      style={{ display: 'inline-block' }}
                      className="w-120 m-r-8"
                      name={['vacationIssueRule', 'timeRule', 'day']}
                    >
                      <DatePicker showTime />
                    </Item>
                  )}
                  <span className="hour-text">自动发放</span>
                </Item>

                <Item label="额度发放人员" style={{ marginBottom: 0 }}>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    className="w-120"
                    name={['vacationIssueRule', 'targetRule', 'targetType']}
                  >
                    <Select onChange={(e) => {}} options={TARGET_USER} />
                  </Item>
                  {formData.vacationIssueRule?.targetRule &&
                    formData.vacationIssueRule.targetRule.targetType === 'specific' && (
                      <div className="targetRule">
                        <span className="hours-InPerDay">性别为</span>
                        <Item
                          label=""
                          style={{ display: 'inline-block', width: 80, marginRight: 8 }}
                          name={['vacationIssueRule', 'targetRule', 'sex']}
                          rules={[{ required: true, message: '请选择性别' }]}
                        >
                          <Select onChange={(e) => {}} options={SEX} />
                        </Item>
                        , 年龄在
                        <Item
                          label=""
                          style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                          name={['vacationIssueRule', 'targetRule', 'minAge']}
                          rules={[{ required: true, message: '' }]}
                        >
                          <InputNumber onChange={(e) => {}} />
                        </Item>
                        <span>-</span>
                        <Item
                          label=""
                          style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                          name={['vacationIssueRule', 'targetRule', 'maxAge']}
                          rules={[{ required: true, message: '' }]}
                        >
                          <InputNumber onChange={(e) => {}} />{' '}
                        </Item>
                      </div>
                    )}
                </Item>
                <Item label="额度计算方式" style={{ marginBottom: 0 }}>
                  <Item
                    label=""
                    style={{ display: 'inline-block', width: '100%' }}
                    name={['vacationIssueRule', 'quotaRule', 'averageType']}
                  >
                    <Select onChange={(e) => {}} options={averageTypeMap} />
                  </Item>
                </Item>
                <Item label="额度取整" style={{ marginBottom: 0 }}>
                  <Item
                    label=""
                    style={{ display: 'inline-block', width: '100%' }}
                    name={['vacationIssueRule', 'quotaRule', 'roundType']}
                  >
                    <Select onChange={(e) => {}} options={roundTypeMap} />
                  </Item>
                </Item>
                <Item label="额度有效期" style={{ marginBottom: 0 }}>
                  <Item
                    label=""
                    style={{ display: 'block', width: 200 }}
                    className="m-r-8"
                    name={['vacationIssueRule', 'expireRule', 'expireType']}
                  >
                    <Select onChange={(e) => {}} options={expireTypeMap} />
                  </Item>
                  {/*固定时间段*/}
                  {formData.vacationIssueRule.expireRule?.expireType === 'fixed_time' && (
                    <>
                      <span className="hour-text m-r-8">自发起日起</span>
                      <Item
                        label=""
                        style={{ display: 'inline-block' }}
                        // className="w-120"
                        name={['vacationIssueRule', 'expireRule', 'fixedTime']}
                      >
                        <InputNumber />
                      </Item>
                      <span className="hour-text m-l-8">天有效</span>
                    </>
                  )}
                  {/*指定某天*/}
                  {formData.vacationIssueRule.expireRule?.expireType === 'specify_day' && (
                    <Item
                      label=""
                      style={{ display: 'inline-block' }}
                      // className="w-120"
                      name={['vacationIssueRule', 'expireRule', 'specifyDay']}
                      rules={[{ required: true, message: '请选择日期' }]}
                    >
                      <DatePicker />
                    </Item>
                  )}
                  {/*直到某天*/}
                  {formData.vacationIssueRule.expireRule?.expireType === 'until_day' && (
                    <Item
                      label=""
                      style={{ display: 'inline-block' }}
                      // className="w-120"
                      name={['vacationIssueRule', 'expireRule', 'untilDay']}
                      rules={[{ required: true, message: '请选择日期' }]}
                    >
                      <DatePicker />
                    </Item>
                  )}
                </Item>
                <Item label="有效期可以延长" style={{ marginBottom: 0 }}>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    name={['vacationIssueRule', 'expireRule', 'extendedTime']}
                  >
                    <InputNumber min={0} defaultValue={0} />
                  </Item>
                  <span className="hour-text m-l-8">天</span>
                </Item>
                <Item label="过期处理方式" style={{ marginBottom: 0 }}>
                  <Item
                    label=""
                    style={{ display: 'inline-block', width: '100%' }}
                    name={['vacationIssueRule', 'expireRule', 'expiredWay']}
                  >
                    <Select onChange={(e) => {}} disabled options={expiredMap} defaultValue={0} />
                  </Item>
                </Item>
                <div className={'quota-rule'}>
                  <Item label="额度配置" style={{ marginBottom: 0 }}>
                    <Item
                      label=""
                      style={{ display: 'inline-block', width: 320 }}
                      className=" m-r-8"
                      name={['vacationIssueRule', 'quotaRule', 'quotaType']}
                    >
                      <Select onChange={(e) => {}} options={quotaTypeMap} />
                    </Item>
                    {/*额度配置 - 固定额度*/}
                    {formData.vacationIssueRule.quotaRule?.quotaType === 'fixed' && (
                      <>
                        <Item
                          label=""
                          style={{ display: 'inline-block' }}
                          className="w-120"
                          name={['vacationIssueRule', 'quotaRule', 'fixedQuota']}
                        >
                          <InputNumber />
                        </Item>
                        <span className="hour-text m-l-8">天</span>
                      </>
                    )}
                    {/*额度配置 - 按社会工龄*/}
                    {formData.vacationIssueRule.quotaRule?.quotaType === 'work_age' && (
                      <>
                        <span className="add-rule-btn">添加规则</span>
                        <QuotaRule />
                      </>
                    )}
                  </Item>
                </div>
              </div>
            )}
          </div>
        </Form>
        <div />
      </div>
    </Drawer>
  );
};
export default AddRulePop;
