import { memo, useEffect } from 'react'
import type { FC } from 'react'
import './Statistics.less'
import { useDispatch } from 'dva'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import { getStatisticsList } from '@/services/statistics'
import Header from './components/Header'
import Filters from './components/Filters'
import Buttons from './components/Buttons'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    fixed: 'left'
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
    title: '事假(小时)',
    children: [
      {
        title: '往年余额',
        dataIndex: 'position',
      },
      {
        title: '当年发放',
        dataIndex: 'type',
      },
      {
        title: '使用数量',
        dataIndex: 'time',
      },
      {
        title: '过期数量',
        dataIndex: 'time',
      },
      {
        title: '结余',
        dataIndex: 'duration',
      }
    ]
  }
]

const Statistics: FC = () => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          action: getStatisticsList,
          columns
        }
      })
    },
    [dispatch]
  )
  return <PageContent className='pg-statistics' hasPadding>
    <Header />
    <div className='pg-statistics--options'>
      <Filters />
      <Buttons />
    </div>
    <StoreTable withFooterPaination bordered />
  </PageContent>
}

export default memo(Statistics)
