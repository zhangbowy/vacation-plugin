import { memo } from 'react';
import type { FC } from 'react';
import {
  DrawerForm,
  ProFormText,
  ProFormCheckbox,
  ProFormSelect,
  ProFormRadio,
  ProFormGroup,
} from '@ant-design/pro-form';
import { Checkbox } from 'antd';

const AuthEdit: FC<{
  id: string;
  visible: boolean;
  onVisibleChange: ({ id, visible }: { id: string; visible: boolean }) => void;
}> = ({ id, visible, onVisibleChange }) => (
  <DrawerForm
    visible={visible}
    onVisibleChange={(newVisible) => onVisibleChange({ visible: newVisible, id: '' })}
    onFinish={async (values: any) => {
      console.log(values);
    }}
    title="新增权限"
    initialValues={{
      name: '蚂蚁设计有限公司',
      useMode: 'chapter',
    }}
  >
    <span>{id}</span>
    <ProFormText
      width="md"
      name="company"
      label="规则名称"
      placeholder="请输入"
      rules={[{ required: true, message: 'Please select your country!' }]}
    />
    <ProFormSelect
      width="xs"
      options={[
        {
          value: 'time',
          label: '履行完终止',
        },
      ]}
      name="unusedMode"
      label="成员"
      placeholder="请选择"
      rules={[{ required: true, message: 'Please select your country!' }]}
    />
    <ProFormRadio.Group
      name="ddds"
      label="管理范围"
      options={[
        { label: '全公司', value: 'aa' },
        { label: '所在部门及其下属部门', value: 'bb' },
        {
          label: (
            <>
              <span>指定部门</span>
              <a>选择部门</a>
            </>
          ),
          value: 'cc',
        },
      ]}
    />
    <ProFormGroup
      label={
        <>
          <span>分配权限</span>
          <Checkbox>全选</Checkbox>
        </>
      }
    >
      <ProFormCheckbox.Group
        name="dfdf"
        label="假期规则"
        options={[
          {
            value: 'time',
            label: '查询假期规则',
          },
        ]}
      />
      <ProFormCheckbox.Group
        name="dfdf2"
        label="假期余额"
        options={[
          {
            value: 'time',
            label: '查询假期余额',
          },
        ]}
      />
    </ProFormGroup>
  </DrawerForm>
);

export default memo(AuthEdit);
