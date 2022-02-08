import React from 'react';
import { ProFormSelect, ProFormDependency, ProFormText } from '@ant-design/pro-form';

import { useTableCrud } from '@/hooks';

function TableDemo() {
  const columns = [
    {
      key: 'username',
      dataIndex: 'username',
      title: '姓名',
    },
    {
      key: 'updateUser',
      dataIndex: 'updateUser',
      title: '分配人',
    },
    {
      key: 'updateTime',
      dataIndex: 'updateTime',
      title: '分配时间',
    },
  ];

  const formItems = (
    <>
      <ProFormSelect
        options={[
          {
            value: 'select',
            label: '选择框',
          },
          {
            value: 'input',
            label: '输入框',
          },
        ]}
        width="xs"
        name="useMode"
        label="组件的类型"
      />

      <ProFormDependency name={['useMode']}>
        {({ useMode }) => {
          if (useMode === 'select') {
            return (
              <ProFormSelect
                options={[
                  {
                    value: 'chapter',
                    label: '盖章后生效',
                  },
                ]}
                width="md"
                name="function"
                label="生效方式"
              />
            );
          }
          return <ProFormText width="md" name="function" label="生效方式" />;
        }}
      </ProFormDependency>
    </>
  );

  const [tableRender] = useTableCrud({
    columns,
    formItems,
    tableHeaderRightProps: { searchInput: { show: false } },
    getHandleColumnProps() {
      return {
        addChildren: {
          hide: true,
        },
        edit: {
          click() {},
        },
        columns: [
          {
            key: 'check-auth',
            text: '查看',
            click() {},
          },
        ],
      };
    },
    crudRequest: {
      create: {
        params() {
          return {};
        },
        request: () => {
          alert('创建');
          return [];
        },
      },

      delete: {
        params(record) {
          return {
            ids: record?.id,
            roleId: record?.roleId,
          };
        },
        request: () => {
          alert('删除');
          return [];
        },
      },

      search: {
        params: {},
        request: () => [
          null,
          {
            data: [
              {
                id: 0,
                username: '用户名',
                updateUser: '分配人',
                updateTime: '2021-03-21',
              },
            ],
          },
        ],
      },
    },
  });

  return <div>{tableRender()}</div>;
}

export default TableDemo;
