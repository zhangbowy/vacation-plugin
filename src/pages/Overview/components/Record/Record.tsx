import { memo, useEffect } from 'react'
import type { FC } from 'react'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch } from 'dva'
import { getLeaveRecord } from '@/services/leave'
import moment from 'moment'
import type { Moment } from 'moment'
import './Record.less'
import RecordOptions from '../RecordOptions'

const columns = [
  {
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    title: '工号',
    dataIndex: 'jobNumber',
  },
  {
    title: '所属部门',
    dataIndex: 'deptName',
  },
  {
    title: '岗位',
    dataIndex: 'position',
  },
  {
    title: '假期名称',
    dataIndex: 'ruleName',
  },
  {
    title: '时间',
    key: 'time',
    rander: ({ startTime, endTime }: { startTime: Date, endTime: Date }) => {
      if (startTime && endTime) {
        return '-'
      }
      return `${
        moment(startTime).format('YYYY-MM-DD HH:mm')
      } ~ ${
        moment(endTime).format('YYYY-MM-DD HH:mm')
      }`
    }
  },
  {
    title: '时长',
    key: 'duration',
    render: (
      { durationType, duration }: { durationType: 0 | 2, duration: number }
    ) =>
      `${duration / 100}${durationType === 0 ? '天' : '小时'}`
  },
  {
    title: '请假理由',
    dataIndex: 'reason',
  }
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
          name: 'record',
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
    <StoreTable name='record' rowKey='userId' withFooterPaination />
  </>
}

export default memo(Record)
