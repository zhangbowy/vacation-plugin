import { memo, useEffect, useState, useMemo } from 'react'
import type { FC } from 'react'
import './Statistics.less'
import { useDispatch, useSelector } from 'dva'
import PageContent from '@/components/structure/PageContent'
import getScroll from '@/components/table/getScroll'
import moment from 'moment'
import StoreTable from '@/components/table/StoreTable'
import { getStatisticsList } from '@/services/statistics'
import checkAuth from '@/utils/checkAuth'
import Header from './components/Header'
import Filters from './components/Filters'
import Buttons from './components/Buttons'

interface Column {
  dataIndex?: string,
  title: string,
  children?: Column[],
  fixed?: string,
  width?: number
}
const defaultColumns = [
  {
    title: '姓名',
    dataIndex: 'user_name',
    width: 109
  },
  {
    title: '工号',
    dataIndex: 'job_number',
    width: 114
  },
  {
    title: '所属部门',
    dataIndex: 'dept_name',
    width: 103
  }
]
const widthMap = {
  user_name: 109, job_number: 114, dept_name: 103
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
                    width: 72
                  })
                  : ({
                    className: 'pg-statistics--child-th not-last',
                    dataIndex: childDataIndex,
                    title: childTitle,
                    width: 72
                  })
            )
          })
        } else {
          r.push({
            title,
            dataIndex,
            width: dataIndex ? widthMap[dataIndex] || 100 : 100
          })
        }
      }
    )
    return r
  }
  return defaultColumns
}

const Statistics: FC = () => {
  const dispatch = useDispatch()
  const columns = useSelector(state => state.table.columns)
  const [data, setData] = useState(null)
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
          resultHandle: (r: any) => {
            if (r && r.data) {
              const { data: resultData, ...rest } = r
              setData(resultData)
              return rest
            }
            return r
          },
          columns: defaultColumns
        }
      })
    },
    [dispatch]
  )
  useEffect(
    () => {
      dispatch({
        type: 'table/update',
        payload: { columns: getColumns(data) }
      })
    },
    [data, dispatch]
  )
  const scroll = useMemo(
    //@ts-ignore
    () => ({ x: getScroll(columns) }),
    [columns]
  )
  return <PageContent className='pg-statistics' hasPadding>
    <Header />
    <div className='pg-statistics--options'>
      <Filters />
      { checkAuth(3002) && <Buttons /> }
    </div>
    <StoreTable
      rowKey='id'
      name='statistics'
      withFooterPaination
      bordered
      scroll={scroll}
    />
  </PageContent>
}

export default memo(Statistics)
