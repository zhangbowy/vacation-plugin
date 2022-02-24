import React, { useEffect } from 'react';
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
import { Space } from 'antd';
import UserSelect from '@/components/form/UserSelect/UserSelect';

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
    value: 1,
    label: '不限时',
  },
  {
    value: 2,
    label: '需提前',
  },
  {
    value: 3,
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

const AddRulePop: FC = () => {
  const { isShowAddPop } = useSelector((state) => ({
    isShowAddPop: state.rules.isShowAddPop,
  }));
  const [form] = useForm();
  const dispatch = useDispatch();
  // 关闭弹窗
  const close = () => {
    dispatch({
      type: 'rules/updateState',
      payload: { isShowAddPop: false },
    });
  };

  useEffect(() => {
    init();
  }, []);
  // 初始化
  const init = () => {};

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
          <Button className={'save-btn'} onClick={() => {}} type="primary">
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
        <Form layout="vertical" form={form} initialValues={{}}>
          {/*基本信息*/}
          <div className="base_info">
            <div className="title">基本信息</div>
            <Item
              label="假期规则名称"
              name="leaveName"
              rules={[{ required: true, message: '请输入' }]}
            >
              <Input placeholder="请输入" showCount={true} maxLength={30} />
            </Item>
          </div>
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
              name="resourceInfo"
            >
              <Select onChange={() => {}} options={APPLICATION_RANGE} />
            </Item>
            <Item
              label=""
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              name="resourceInfo"
            >
              <UserSelect placeholder="请选择" />
            </Item>
          </Item>
          <Item label="是否带薪" name="range">
            <Group>
              <Space direction="vertical">
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Space>
            </Group>
          </Item>
          <Item label="限时提交" style={{ marginBottom: 0 }}>
            <Item
              label=""
              style={{ display: 'inline-block' }}
              className="w-120"
              name="resourceInfo"
            >
              <Select onChange={() => {}} options={LIMIT_SUBMIT} />
              <div className={''} />
            </Item>
            <Item
              label=""
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              name="resourceInfo"
            >
              <Select onChange={() => {}} options={APPLICATION_RANGE} />
              <div className={''} />
            </Item>
          </Item>
          <Item label="员工请假时提交证明" style={{ marginBottom: 0 }}>
            <Item
              label=""
              style={{ display: 'inline-block' }}
              className="w-120"
              name="resourceInfo"
            >
              <Select onChange={() => {}} options={PROVE} />
              <div className={''} />
            </Item>

            <Item
              label=""
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              name="resourceInfo"
            >
              <Input onChange={() => {}} />
            </Item>
          </Item>
        </Form>
        <div />
      </div>
    </Drawer>
  );
};

export default AddRulePop;
