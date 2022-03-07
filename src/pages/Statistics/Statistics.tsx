import { memo, useEffect } from 'react'
import type { FC } from 'react'
import './Statistics.less'
import { useDispatch } from 'dva'
import PageContent from '@/components/structure/PageContent'
import moment from 'moment'
import StoreTable from '@/components/table/StoreTable'
import { getStatisticsList } from '@/services/statistics'
import checkAuth from '@/utils/checkAuth'
import useTableStoreScroll from '@/hooks/useTableStoreScroll'
import useTableStoreActiveColumn from '@/hooks/useTableStoreActiveColumn'
import Header from './components/Header'
import Filters from './components/Filters'
import Buttons from './components/Buttons'

const tableName = 'statistics'

interface Column {
  dataIndex?: string,
  title: string,
  children?: Column[],
  fixed?: string,
  width?: number,
  render?: (x: any) => any
}
const defaultColumns = [
  {
    title: '姓名',
    dataIndex: 'user_name',
    width: 109,
    render: (v: string) => v || '-'
  },
  {
    title: '工号',
    dataIndex: 'job_number',
    width: 114,
    render: (v: string) => v || '-'
  },
  {
    title: '所属部门',
    dataIndex: 'dept_name',
    width: 143,
    render: (v: string) => v || '-'
  }
]
const widthMap = {
  user_name: 109, job_number: 114, dept_name: 143
}
const getColumns = (data?: Column[] | null) => {
  if (data) {
    const r: Column[] = []
    data.forEach(
      ({ title, dataIndex, children }: Column) => {
        if (children && children.length) {
          const lastIndex = children.length - 1
          r.push({
            title,
            children: children.map(
              ({ dataIndex: childDataIndex, title: childTitle }: Column, i) =>
                lastIndex === i
                  ? ({
                    className: 'pg-statistics--child-th',
                    dataIndex: childDataIndex,
                    title: childTitle,
                    width: 72,
                    render: (v: string) => v || '-'
                  })
                  : ({
                    className: 'pg-statistics--child-th not-last',
                    dataIndex: childDataIndex,
                    title: childTitle,
                    width: 72,
                    render: (v: string) => v || '-'
                  })
            )
          })
        } else {
          r.push({
            title,
            dataIndex,
            width: dataIndex ? widthMap[dataIndex] || 100 : 100,
            render: (v: string) => v || '-'
          })
        }
      }
    )
    return r
  }
  return defaultColumns
}

const Statistics: FC = () => {
  const updateData = useTableStoreActiveColumn(getColumns)
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          name: 'statistics',
          action: getStatisticsList,
          params: {
            pickerMode: 'year',
            date: moment(),
            status: 1
          },
          paramsHandle: (
            p: Record<string, any> = {}, pageNo: number, pageSize: number
          ) => {
            const { pickerMode, date, status, ...rest } = p
            rest.year = date.year()
            if (pickerMode === 'month') {
              rest.month = date.month() + 1
            }
            rest.isLeave = !status
            rest.pageNo = pageNo || 1
            rest.pageSize = pageSize || 10
            return rest
          },
          resultHandle: (r: any, _: number, pageSize: number) => {
            const { page } = r || {}
            const { currentPage = 1, total = 0 } = page
            if (r && r.data) {
              const { data: resultData, ...rest } = r
              updateData(resultData)
              return {
                ...rest,
                pageNo: currentPage,
                total,
                pageSize
              }
            }
            return {
              ...(r || {}),
              pageNo: currentPage,
              total,
              pageSize
            }
          },
          columns: defaultColumns
        }
      })
    },
    [dispatch, updateData]
  )
  useEffect(
    () => {
      return () => {
        dispatch({ type: 'table/close' })
      }
    },
    []
  )
  const scroll = useTableStoreScroll()
  return <PageContent className='pg-statistics' hasPadding>
    <Header />
    <div className='pg-statistics--options'>
      <Filters tableName={tableName} />
      { checkAuth(3002) && <Buttons /> }
    </div>
    <StoreTable
      rowKey='id'
      name={tableName}
      withFooterPagination
      bordered
      scroll={scroll}
    />
  </PageContent>
}

export default memo(Statistics)
