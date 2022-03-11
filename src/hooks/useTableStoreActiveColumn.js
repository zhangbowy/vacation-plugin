import { useState, useEffect } from 'react'
import { useDispatch } from 'dva'

const useTableStoreActiveColumn = getColumns => {
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  useEffect(
    () => {
      dispatch({
        type: 'table/update',
        payload: { columns: getColumns(data) }
      })
    },
    [data, dispatch, getColumns]
  )
  return setData
}

export default useTableStoreActiveColumn
