import { useMemo } from 'react'
import { useSelector } from 'dva'
import getScroll from '@/components/table/getScroll'

export default () => {
  const columns = useSelector(state => state.table.columns)
  return useMemo(
    //@ts-ignore
    () => ({ x: getScroll(columns) }),
    [columns]
  )
}
