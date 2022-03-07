import { memo, useEffect } from 'react'
import type { FC } from 'react'
import moment from 'moment'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch } from 'dva'
import { getLogList } from '@/services/operateLog'
import Header from './components/Header'
import Filters from './components/Filters'

const tableName = 'log'

const operateTypeMap = {
  1: '假期规则', 2: '假期余额', 3: '统计报表', 4: '休假总览', 5: '权限设置'
}

const columns = [
  {
    title: '时间',
    dataIndex: 'createTime',
    render: (createTime: number) =>
      moment(createTime).format('YYYY-MM-DD HH:mm'),
    width: '26.942%'
  },
  {
    title: '操作人员',
    dataIndex: 'operateUserName',
    width: '17.597%'
  },
  {
    title: '操作模块',
    dataIndex: 'operateType',
    width: '20.874%',
    render: (v: 1 | 2 | 3 | 4 | 5) => operateTypeMap[v] || '-'
  },
  {
    title: '操作内容',
    key: 'operateContent',
    width: '34.587%',
    render: (
      { operateContent, operateFileName, operateFileUrl }:
      {
        operateContent: {
          title: string,
          changeDatas?: { field: string, before: string, after: string }[]
        },
        operateFileName: string,
        operateFileUrl: string
      }
    ) => {
      const { title = '', changeDatas = [] } = operateContent || {}
      if (operateFileUrl) {
        const name = operateFileName || '下载明细'
        return <>
          <span>{ `${title}：` }</span>
          <a href={operateFileUrl} download={name} target='_blacnk'>{ name }</a>
        </>
      }
      return <>
        <span>
          {
            `${title}${
              changeDatas.length > 0
                ? `：${
                  changeDatas.map(
                    ({ field, before, after }) =>
                      `${field}修改前${before}，修改后${after}`
                  ).join('；')
                }`
                : ''
            }`
          }
        </span>
      </>
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
          resultHandle: (fetchResult: any, _: number, pageSize: number) => {
            const {  page = {}, list, ...rest } = fetchResult || {}
            const { currentPage = 1, total = 0 } = page
            return {
              list: list.map((v: any, i: number) => ({ ...v, key: i })),
              ...rest,
              total,
              pageNo: currentPage,
              pageSize
            }
          }
        }
      })
    },
    [dispatch]
  )
  useEffect(
    () => {
      return () => {
        dispatch({ type: 'table/close' })
      }
    },
    []
  )
  return <PageContent className='pg-auth' hasPadding>
    <Header />
    <Filters tableName={tableName} />
    <StoreTable name={tableName} rowKey='key' withFooterPagination />
  </PageContent>
}

export default memo(Log)
