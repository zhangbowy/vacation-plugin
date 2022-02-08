import { memo, useState } from 'react';
import type { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import Survey from './components/Survey';
import Record from './components/Record';

const Overview: FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('survey');
  console.log('tabActiveKey', tabActiveKey);
  return (
    <PageContainer
      fixedHeader
      tabActiveKey={tabActiveKey}
      onTabChange={setTabActiveKey}
      tabList={[
        {
          tab: '休假概况',
          key: 'survey',
        },
        {
          tab: '请假记录',
          key: 'record',
        },
      ]}
    >
      {tabActiveKey === 'survey' ? <Survey /> : <Record />}
    </PageContainer>
  );
};

export default memo(Overview);
