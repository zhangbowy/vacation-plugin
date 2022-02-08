import { memo, useState } from 'react';
import type { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import AuthEdit from './components/AuthEdit';

type AuthItem = {
  name: string;
  user: string;
  range: string;
  auth: string;
};

const columns: ProColumns<AuthItem>[] = [
  {
    title: '权限名称',
    dataIndex: 'name',
  },
  {
    title: '成员',
    dataIndex: 'user',
  },
  {
    title: '管理范围',
    dataIndex: 'range',
  },
  {
    title: '权限',
    dataIndex: 'auth',
  },
  {
    title: '操作',
    key: 'option',
    render: () => [<a key="edit">编辑</a>, <a key="remove">删除</a>],
  },
];

const Auth: FC = () => {
  const [info, setInfo] = useState<{ visible: boolean; id: string }>({ visible: false, id: '' });
  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        search={false}
        pagination={{
          pageSize: 10,
        }}
        options={false}
        request={async (params) => {
          console.log('params', params);
          return {
            data: [
              {
                id: 'xxx',
                name: 'dfdf',
                user: 'aaa',
                range: 'tt',
                auth: 'ww',
              },
            ],
            success: true,
            total: 1,
          };
        }}
        headerTitle={
          <Button type="primary" key="primary" onClick={() => setInfo({ visible: true, id: '' })}>
            新增权限
          </Button>
        }
      />
      <AuthEdit {...info} onVisibleChange={(newInfo) => setInfo(newInfo)} />
    </PageContainer>
  );
};

export default memo(Auth);
