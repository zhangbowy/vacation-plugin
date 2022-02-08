import { memo } from 'react';
import type { FC } from 'react';
import { Calendar, Select } from 'antd';

const Survey: FC = () => (
  <div className="survey">
    <Select placeholder="选择部门" options={[{ label: '部门', value: 'x' }]} />
    <Calendar />
  </div>
);

export default memo(Survey);
