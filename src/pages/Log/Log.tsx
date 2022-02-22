import { memo, useEffect } from 'react'
import type { FC } from 'react'
import moment from 'moment'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch } from 'dva'
import { getLogList } from '@/services/operateLog'
import Header from './components/Header'
import Filters from './components/Filters'

console.log('need operateTypes')
const columns = [
  {
    title: '时间',
    dataIndex: 'createTime',
    render: (createTime: number) =>
      moment(createTime).format('YYYY-MM-DD HH:mm')
  },
  {
    title: '操作人员',
    dataIndex: 'operateUserName'
  },
  {
    title: '操作模块',
    dataIndex: 'operateType'
  },
  {
    title: '操作内容',
    key: 'operateContent',
    render: (
      { operateContent, operateFileName, operateFileUrl }:
      {
        operateContent: string, operateFileName: string, operateFileUrl: string
      }
    ) => {
      if (operateFileUrl) {
        const name = operateFileName || '下载明细'
        return <>
          <span>{ `${operateContent}&nbsp;&nbsp;` }</span>
          <a href={operateFileUrl} download={name} target='_blacnk'>{ name }</a>
        </>
      }
      return operateContent
    }
  },
]

const Log: FC = () => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          name: 'log',
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
          columns,
          resultHandle: (fetchResult: any) => {
            const { list, ...rest } = fetchResult || {}
            return {
              list: list.map((v: any, i: number) => ({ ...v, key: i })),
              ...rest
            }
          }
        }
      })
    },
    [dispatch]
  )
  return <PageContent className='pg-auth' hasPadding>
    <Header />
    <Filters />
    <StoreTable name='log' rowKey='key' withFooterPaination />
  </PageContent>
}

export default memo(Log)
