import { memo, useEffect, useState, useMemo } from 'react'
import type { FC } from 'react'
import './Statistics.less'
import { useDispatch, useSelector } from 'dva'
import PageContent from '@/components/structure/PageContent'
import getScroll from '@/components/table/getScroll'
import moment from 'moment'
import StoreTable from '@/components/table/StoreTable'
import { getStatisticsList } from '@/services/statistics'
import Header from './components/Header'
import Filters from './components/Filters'
import Buttons from './components/Buttons'

const defaultColumnIndex = {
  user_name: true, job_number: true, dept_name: true
}
interface Column {
  dataIndex?: string,
  title: string,
  children?: Column[],
  fixed?: string,
  width?: number
}
const getColumns = (data?: Column[] | null) => {
  const r: Column[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 109
    },
    {
      title: '工号',
      dataIndex: 'no',
      width: 114
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      width: 103
    }
  ]
  if (data) {
    data.forEach(
      ({ title, dataIndex, children }: Column) => {
        if (
          (!dataIndex || !defaultColumnIndex[dataIndex]) &&
          children &&
          children.length
        ) {
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
        }
      }
    )
    return r
  }
  return r
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
          columns: getColumns()
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
      <Buttons />
    </div>
    <StoreTable
      name='statistics'
      withFooterPaination
      bordered
      scroll={scroll}
    />
  </PageContent>
}

export default memo(Statistics)
