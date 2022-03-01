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
import { Space, Switch } from 'antd';
import UserSelect from '@/components/form/UserSelect/UserSelect';
import { addRule } from '@/services/rules';
import { errMsg } from '@/components/pop';

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
    value: 0,
    label: '不需要',
  },
  {
    value: 1,
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
const level2Data = {
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

const AddRulePop: FC = () => {
  const { isShowAddPop } = useSelector((state) => ({
    isShowAddPop: state.rules.isShowAddPop,
  }));
  const [form] = useForm();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    whenCanLeave: 'entry', //
    paidLeave: true, // 是否带薪休假
    bizType: 'general_leave', // 假期规则
    APPLICATION_RANGE: 1, // 适用范围
    PROVE: 0, // 请假时提交证明
    leaveViewUnit: 'day',
    isLimitDuration: 0, // 是否限制请假时长
    hoursInPerDay: 8, // 每日工时折算,
    naturalDayLeave: true,
    timeType: undefined,
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
    targetRule: {
      targetType: '',
    },
    vacationIssueRule: {
      freedomLeave: false,
    },
    isLimitLeaveTime: false,
  });
  // 关闭弹窗
  const close = () => {
    dispatch({
      type: 'rules/updateState',
      payload: { isShowAddPop: false },
    });
  };

  // 初始化
  const init = () => {
    form.setFieldsValue({
      whenCanLeave: 'entry', //
      paidLeave: true, // 是否带薪休假
      bizType: 'general_leave', // 假期规则
      APPLICATION_RANGE: 1, // 适用范围
      LIMIT_SUBMIT: 1,
      PROVE: 0, // 请假时提交证明
      leaveViewUnit: 'day',
      isLimitDuration: 0, // 是否限制请假时长
      hoursInPerDay: 8, // 每日工时折算,
      naturalDayLeave: true,
      timeType: 'none',
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
      },
      targetRule: {
        targetType: 'probational_normal',
      },
      // 是否限制最大请假时间
      isLimitLeaveTime: false,
    });
  };

  useEffect(() => {
    init();
  }, [form]);

  const onChange_value = (changedValues: any, allVal: any) => {
    console.log(changedValues, allVal);
    setFormData(allVal);
  };

  const onClick_save = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        const params = {
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
          isLimitLeaveTime: undefined, // 是否限制最大请假时间
          vacationIssueRule: values.vacationIssueRule, // 假期额度设置
        };

        // 如果开启了限制单次最大请假时间
        if (values.isLimitLeaveTime) {
          params.isLimitLeaveTime = values.isLimitLeaveTime;
          params.maxLeaveTime = values.maxLeaveTime;
        }

        addRule(params).then((res) => {
          console.log(res);
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
          <Button className={'save-btn'} onClick={onClick_save} type="primary">
            保存
          </Button>
        </div>
      }
    >
      {/*抽屉的自定义头*/}
      <div className="customer_header">
        <div className="title_box">
          <div className={'customer_title'}>添加假期规则</div>
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
                  name="users"
                >
                  <div className="app_range_user_select">
                    <UserSelect placeholder="请选择" />
                  </div>
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
            <Item
              label="最小请假单位"
              name="leaveViewUnit"
              className="w-120"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Group>
                <Space direction="vertical">
                  <Radio value={'day'}>1天</Radio>
                  <Radio value={'halfDay'}>半天</Radio>
                  <Radio value={'hour'}>小时</Radio>
                </Space>
              </Group>
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
                <Switch />
              </Item>
            </div>
            {formData.vacationIssueRule.freedomLeave && (
              <>
                <Item label="" style={{ marginBottom: 0 }}>
                  <Item
                    label="额度发放方式"
                    style={{ display: 'inline-block' }}
                    className="w-120"
                    name={['timeRule', 'issueType']}
                  >
                    <Select onChange={(e) => {}} options={level1Data} />
                  </Item>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    className="w-120"
                    name={['timeRule', 'issueTimeType']}
                  >
                    <Select onChange={(e) => {}} options={level1Data} />
                  </Item>
                  <Item
                    label=""
                    style={{ display: 'inline-block' }}
                    className="w-120"
                    name={['timeRule', 'targetType']}
                  >
                    <Select onChange={(e) => {}} options={TARGET_USER} />
                  </Item>
                  {formData.targetRule && formData.targetRule.targetType === 'specific' && (
                    <div className="targetRule">
                      <span className="hours-InPerDay">性别为</span>
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: 80, marginRight: 8 }}
                        name={['targetRule', 'sex']}
                        rules={[{ required: true, message: '请选择性别' }]}
                      >
                        <Select onChange={(e) => {}} options={SEX} />
                      </Item>
                      , 年龄在
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                        name={['targetRule', 'minAge']}
                        rules={[{ required: true, message: '' }]}
                      >
                        <InputNumber onChange={(e) => {}} />
                      </Item>
                      <span>-</span>
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                        name={['targetRule', 'maxAge']}
                        rules={[{ required: true, message: '' }]}
                      >
                        <InputNumber onChange={(e) => {}} />{' '}
                      </Item>
                    </div>
                  )}
                </Item>

                <Item label="" style={{ marginBottom: 0 }}>
                  <Item
                    label="额度发放人员"
                    style={{ display: 'block' }}
                    className="w-120"
                    name={['targetRule', 'targetType']}
                  >
                    <Select onChange={(e) => {}} options={TARGET_USER} />
                  </Item>
                  {formData.targetRule && formData.targetRule.targetType === 'specific' && (
                    <div className="targetRule">
                      <span className="hours-InPerDay">性别为</span>
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: 80, marginRight: 8 }}
                        name={['targetRule', 'sex']}
                        rules={[{ required: true, message: '请选择性别' }]}
                      >
                        <Select onChange={(e) => {}} options={SEX} />
                      </Item>
                      , 年龄在
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                        name={['targetRule', 'minAge']}
                        rules={[{ required: true, message: '' }]}
                      >
                        <InputNumber onChange={(e) => {}} />
                      </Item>
                      <span>-</span>
                      <Item
                        label=""
                        style={{ display: 'inline-block', width: 80, margin: '0 8px' }}
                        name={['targetRule', 'maxAge']}
                        rules={[{ required: true, message: '' }]}
                      >
                        <InputNumber onChange={(e) => {}} />{' '}
                      </Item>
                    </div>
                  )}
                </Item>
                <Item label="" style={{ marginBottom: 0 }}>
                  <Item
                    label="额度计算方式"
                    style={{ display: 'inline-block' }}
                    className="w-120"
                    name="APPLICATION_RANGE"
                  >
                    <Select onChange={(e) => {}} options={APPLICATION_RANGE} />
                  </Item>
                </Item>
              </>
            )}
          </div>
        </Form>
        <div />
      </div>
    </Drawer>
  );
};

export default AddRulePop;
