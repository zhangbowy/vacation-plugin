import { memo, useEffect } from 'react'
import type { FC } from 'react'
import moment from 'moment'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch } from 'dva'
import { getLogList } from '@/services/operateLog'
import Header from './components/Header'
import Filters from './components/Filters'

const columns = [
  {
    title: '时间',
    dataIndex: 'time',
    render: (_: any, { time }: { time: any }) =>
      moment(time).format('YYYY-MM-DD HH:mm')
  },
  {
    title: '操作人员',
    dataIndex: 'user'
  },
  {
    title: '操作模块',
    dataIndex: 'modal'
  },
  {
    title: '操作内容',
    dataIndex: 'content'
  },
]

const Log: FC = () => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          action: getLogList,
          paramsHandle: (
            p: Record<string, any> = {}, pageNo: number, pageSize: number
          ) => {
            const { rangeTime, ...rest } = p
            if (rangeTime && rangeTime[0]) {
              rest.startTime = `${rangeTime[0].format('YYYY-MM-DD')} 00:00:00`
              rest.endTime = `${rangeTime[1].format('YYYY-MM-DD')} 23:59:59`
            }
            rest.pageNo = pageNo || 1
            rest.pageSize = pageSize || 10
            return rest
          },
          columns
        }
      })
    },
    [dispatch]
  )
  return <PageContent className='pg-auth' hasPadding>
    <Header />
    <Filters />
    <StoreTable withFooterPaination />
  </PageContent>
}

export default memo(Log)
