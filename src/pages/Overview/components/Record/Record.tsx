import { memo } from 'react';
import type { FC } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, Input, Select, DatePicker } from 'antd';

type RecordItem = {
  name: string;
  no: string;
  department: string;
  position: string;
  type: string;
  time: Date;
  duration: string;
};

const columns: ProColumns<RecordItem>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '工号',
    dataIndex: 'no',
  },
  {
    title: '所属部门',
    dataIndex: 'department',
  },
  {
    title: '岗位',
    dataIndex: 'position',
  },
  {
    title: '假期名称',
    dataIndex: 'type',
  },
  {
    title: '时间',
    dataIndex: 'time',
  },
  {
    title: '时长',
    dataIndex: 'duration',
  },
];

const Record: FC = () => (
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
            name: 'd',
            no: 'string',
            department: 'string',
            position: 'string',
            type: 'string',
            time: new Date(),
            duration: 'string',
          },
        ],
        success: true,
        total: 1,
      };
    }}
    headerTitle={
      <div>
        <div>
          <Input placeholder="搜索员工姓名" />
          <Select placeholder="选择假期" />
          <DatePicker placeholder="选择时间" />
        </div>
        <Button type="primary" key="primary">
          导出
        </Button>
      </div>
    }
  />
);

export default memo(Record);
