import { memo, useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent'
import type { Moment } from 'moment'
import { getDropdownList } from '@/services/vacationType'
import checkAuth from '@/utils/checkAuth'
import Survey from './components/Survey';
import Record from './components/Record';
import Header from './components/Header'

const tabs = [
  { tab: '休假概况', key: 'survey' },
  { tab: '请假记录', key: 'record' }
]

const Overview: FC = () => {
  const refDestroyed = useRef(false)
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
  const [ruleOptions, setRuleOptionss] = useState([])
  useEffect(
    () => {
      refDestroyed.current = false
      getDropdownList().then(
        d => {
          const [success, result] = d
          if (success && !refDestroyed.current) {
            setRuleOptionss(
              (result || []).map(
                ({ id, name }: { id: string | number, name: string }) =>
                  ({ label: name, value: id })
              )
            )
          }
        }
      )
      return () => {
        refDestroyed.current = true
      }
    },
    []
  )
  return (
    <PageContent
      className='pg-overview'
      hasPadding
    >
      <Header
        tabs={checkAuth(4002) ? tabs : [tabs[0]]}
        activeKey={tabActiveKey}
        onTabChange={onTabChange}
      />
      {
        tabActiveKey === 'survey'
          ? <Survey changeSelecteDate={changeSelecteDate} />
          : <Record refDates={refDates} ruleOptions={ruleOptions} />
      }
    </PageContent>
  );
};

export default memo(Overview);
