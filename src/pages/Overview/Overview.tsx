import { memo, useState, useRef } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent'
import type { Moment } from 'moment'
import Survey from './components/Survey';
import Record from './components/Record';
import Header from './components/Header'

const tabs = [
  { tab: '休假概况', key: 'survey' },
  { tab: '请假记录', key: 'record' }
]

const Overview: FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('survey');
  const refDates = useRef<[Moment, Moment] | null>(null)
  const changeSelecteDate = (date: Moment) => {
    refDates.current = [
      date.clone().startOf('day'), date.clone().endOf('day')
    ]
    setTabActiveKey('record')
  }
  const onTabChange = (key: string) => {
    if (key === 'survey') {
      refDates.current = null
    }
    setTabActiveKey(key)
  }
  return (
    <PageContent
      className='pg-overview'
      hasPadding
    >
      <Header
        tabs={tabs}
        activeKey={tabActiveKey}
        onTabChange={onTabChange}
      />
      {
        tabActiveKey === 'survey'
          ? <Survey changeSelecteDate={changeSelecteDate} />
          : <Record refDates={refDates} />
      }
    </PageContent>
  );
};

export default memo(Overview);
