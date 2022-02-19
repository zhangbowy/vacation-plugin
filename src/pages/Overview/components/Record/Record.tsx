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

const Record: FC<{ selectedDate: Moment | null }> = ({ selectedDate }) => {
  const dispatch = useDispatch()
  console.log('useDispatch', dispatch)
  useEffect(
    () => {
      console.log('selectedDate', selectedDate)
    },
    [selectedDate]
  )
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          action: getLeaveRecord,
          columns
        }
      })
    },
    [dispatch]
  )
  return <>
    <RecordOptions />
    <StoreTable withFooterPaination />
  </>
}

export default memo(Record)
