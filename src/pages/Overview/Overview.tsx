import { memo, useState } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent'
import Survey from './components/Survey';
import Record from './components/Record';
import Header from './components/Header'

const tabs = [
  { tab: '休假概况', key: 'survey' },
  { tab: '请假记录', key: 'record' }
]

const Overview: FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('survey');
  console.log('tabActiveKey', tabActiveKey);
  return (
    <PageContent
      className='pg-overview'
      hasPadding
    >
      <Header
        tabs={tabs}
        activeKey={tabActiveKey}
        onTabChange={setTabActiveKey}
      />
      { tabActiveKey === 'survey' ? <Survey /> : <Record /> }
    </PageContent>
  );
};

export default memo(Overview);
