import { memo, useEffect } from 'react'
import type { FC } from 'react'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch } from 'dva'
import { getLeaveRecord } from '@/services/leave'
import type { Moment } from 'moment'
import './Record.less'
import RecordOptions from '../RecordOptions'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
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
    title: '岗位',
    dataIndex: 'position',
  },
  {
    title: '假期名称',
    dataIndex: 'type',
  },
  {
    title: '时间',
    dataIndex: 'time',
  },
  {
    title: '时长',
    dataIndex: 'duration',
  },
]

interface RecordProps {
  refDates: { current: [Moment, Moment] | null }
}

const Record: FC<RecordProps> = ({ refDates }) => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      const params: Record<string, any> = {}
      if (refDates && refDates.current && refDates.current[0]) {
        params.date = refDates.current
      }
      dispatch({
        type: 'table/initTable',
        payload: {
          action: getLeaveRecord,
          columns,
          params,
          paramsHandle: (
            p: Record<string, any> = {}, pageNo: number, pageSize: number
          ) => {
            const { date, ...rest } = p
            if (date && date[0]) {
              rest.startDate = +date[0]
              rest.endDate = +date[1]
            }
            rest.pageNo = pageNo || 1
            rest.pageSize = pageSize || 10
            return rest
          }
        }
      })
    },
    [dispatch, refDates]
  )
  return <>
    <RecordOptions />
    <StoreTable withFooterPaination />
  </>
}

export default memo(Record)
