import { memo, useMemo, useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import { useDispatch } from 'dva';
import Drawer from '@/components/pop/Drawer';
import Form, { Item, useForm } from '@/components/form/Form';
import { msg, errMsg } from '@/components/pop';
import Input from '@/components/form/Input';
import Icon from '@/components/Icon';
import UserSelect from '@/components/form/UserSelect';
import Button from '@/components/buttons/Button';
import { updateRole, getRoleDetail } from '@/services/role';
import loading from '@/components/pop/loading';
import CheckGroups from '../CheckGroups';
import RangeSelect from '../RangeSelect';
import './AuthEdit.less';

const rules = [
  () => ({
    validator(_rule: any, value: any) {
      if (value) {
        const { dataAuthority, depts } = value
        if (dataAuthority === 2 && (!depts || !depts.length)) {
          return Promise.reject(new Error('请选择指定部门'));
        }
      }
      return Promise.resolve();
    },
  })
]

interface AuthEditProps {
  id: string;
  visible: boolean;
  onVisibleChange: ({ id, visible }: { id: string; visible: boolean }) => void;
  resourceList: any[] | null;
}

const getInitialValues = () => ({
  range: {
    depts: [],
    dataAuthority: 0,
  },
});

const AuthEdit: FC<AuthEditProps> = ({ id, visible, onVisibleChange, resourceList }) => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const dispatch = useDispatch();
  const [form] = useForm();
  const handleVisibleChange = useCallback(
    () =>
      onVisibleChange({
        visible: false,
        id: '',
      }),
    [onVisibleChange],
  );
  const showCount = useMemo(
    () => ({
      formatter: ({ count, maxLength }: { count: number; maxLength?: number }) => (
        <p>
          <span className='pg-auth--edit--count'>{count}</span>
          <span className='pg-auth--edit--max-count'>{`/${maxLength}`}</span>
        </p>
      ),
    }),
    [],
  );
  const handleConfirm = useCallback(() => {
    loading.show();
    form
      .validateFields()
      .then((values) => {
        const { dingUsers, name, range, resourceInfo } = values;
        const { dataAuthority, depts } = range;
        const { isAllHandleAuthority, resourceMap = {} } = resourceInfo || {};
        const params = {
          id,
          name,
          dataAuthority,
          deptIds: (depts || []).map(({ id: deptId }: { id: string | number }) => deptId),
          dingUserIds: (dingUsers || []).map(({ emplId }: { emplId: string | number }) => emplId),
          isAllHandleAuthority: isAllHandleAuthority || false,
          resourceIds: Object.entries(resourceMap)
            .filter((v) => v[1])
            .map(([key]) => key),
        };
        updateRole(params).then(([success]) => {
          loading.hide();
          if (success) {
            msg(id ? '权限编辑成功' : '权限添加成功');
            dispatch({ type: 'table/refreshTable' });
            handleVisibleChange();
          } else {
            errMsg(id ? '编辑失败，请重试' : '添加失败，请重试');
          }
        });
      })
      .catch((e) => {
        loading.hide();
        const { errorFields = [] } = e;
        if (errorFields[0] && errorFields[0].errors) {
          const errors = errorFields[0].errors || [];
          errMsg(errors[0] || '参数错误，请检查');
        } else {
          errMsg(e);
        }
      });
  }, [id, form, dispatch, handleVisibleChange]);
  useEffect(() => {
    if (visible) {
      if (id) {
        getRoleDetail({ id }).then((d) => {
          const [success, result] = d;
          if (success) {
            const {
              dataAuthority = 0,
              deptBOs = [],
              isAllHandleAuthority = false,
              name = '',
              resourceVOS = [],
              userBOS = [],
            } = result;
            const resourceMap = {};
            if (isAllHandleAuthority) {
              const list = resourceList || [];
              list.forEach(
                ({ resourceId, children }: { resourceId: string | number; children?: [] }) => {
                  resourceMap[resourceId] = true;
                  if (children) {
                    children.forEach(
                      ({ resourceId: childResourceId }: { resourceId: string | number }) => {
                        resourceMap[childResourceId] = true;
                      },
                    );
                  }
                },
              );
            } else {
              resourceVOS.forEach(({ resourceId }: { resourceId: string | number }) => {
                resourceMap[resourceId] = true;
              });
            }
            setInitialValues({
              name,
              dingUsers: userBOS.map(
                ({
                  name: userName,
                  dingUserId,
                }: {
                  name: string;
                  dingUserId: string | number;
                }) => ({
                  emplId: dingUserId,
                  name: userName,
                }),
              ),
              range: {
                dataAuthority,
                depts: deptBOs.map(
                  ({ deptId, name: deptName }: { deptId: string | number; name: string }) => ({
                    id: deptId.toString(),
                    name: deptName,
                  }),
                ),
              },
              resourceInfo: {
                isAllHandleAuthority,
                resourceMap,
              },
            });
          } else {
            setInitialValues(getInitialValues());
          }
        });
      } else {
        setInitialValues(getInitialValues());
      }
    }
  }, [visible, id, resourceList]);
  useEffect(() => {
    if (initialValues) {
      form.resetFields();
    }
  }, [initialValues, form]);
  const footer = useMemo(
    () => (
      <div>
        <Button onClick={handleVisibleChange}>取消</Button>
        <Button type='primary' onClick={handleConfirm}>
          保存
        </Button>
      </div>
    ),
    [handleVisibleChange, handleConfirm],
  );
  return (
    <Drawer
      className='pg-auth--edit'
      visible={visible}
      onClose={handleVisibleChange}
      title={id ? '编辑权限' : '新增权限'}
      width={600}
      closeIcon={<Icon type='icon-guanbi' />}
      footer={footer}
    >
      <Form layout='vertical' form={form} initialValues={initialValues}>
        <Item
          label='规则名称'
          name='name'
          rules={[{ required: true, message: '请输入规则名称' }]}
        >
          <Input placeholder='请输入' showCount={showCount} maxLength={30} />
        </Item>
        <Item
          label='成员'
          name='dingUsers'
          rules={[{ required: true, message: '请选择成员' }]}
        >
          <UserSelect placeholder='请选择' />
        </Item>
        <Item label='管理范围' name='range' rules={rules}>
          <RangeSelect />
        </Item>
        <Item
          label='分配权限'
          name='resourceInfo'
          rules={[
            () => ({
              validator(_rule, value) {
                if (
                  value &&
                  value.resourceMap &&
                  Object.values(value.resourceMap).some(Boolean)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('请勾选分配权限'));
              },
            }),
          ]}
        >
          <CheckGroups resourceList={resourceList} />
        </Item>
      </Form>
    </Drawer>
  );
};

export default memo(AuthEdit);
