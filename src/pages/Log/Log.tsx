import { memo } from 'react';
import type { FC } from 'react';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';

type LogItem = {
  time: Date;
  user: string;
  modal: string;
  content: string;
};

const columns: ProColumns<LogItem>[] = [
  {
    title: '时间',
    dataIndex: 'time',
    valueType: 'dateTime',
    render: (_, { time }) => moment(time).format('YYYY-MM-DD HH:mm'),
    order: 100,
    fieldProps: {
      showTime: false,
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '操作人员',
    dataIndex: 'user',
    order: 97,
  },
  {
    title: '操作模块',
    dataIndex: 'modal',
    valueEnum: {
      1: { text: '假期规则' },
      2: { text: '假期余额' },
      3: { text: '统计报表' },
      4: { text: '休假总览' },
    },
    order: 98,
  },
  {
    title: '操作内容',
    dataIndex: 'content',
    hideInSearch: true,
  },
];

const Log: FC = () => (
  <ProTable
    rowKey="id"
    pagination={{
      pageSize: 10,
    }}
    search={{
      optionRender: false,
      collapsed: false,
    }}
    request={async (params) => {
      console.log('params', params);
      return {
        data: [
          {
            id: 'xxx',
            time: new Date(),
            user: 'aaa',
            modal: 'tt',
            content: 'ww',
          },
        ],
        success: true,
        total: 1,
      };
    }}
    toolBarRender={false}
    columns={columns}
  />
);

export default memo(Log);
