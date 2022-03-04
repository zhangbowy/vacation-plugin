import { useSelector } from 'dva'

const useTableParams = (paramsNames, tableName) => {
  const params = useSelector(
    state => {
      if (!paramsNames) {
        return {}
      }
      const { name, params } = state.table
      const r = {}
      const isCurrentTable = !tableName || name === tableName
      paramsNames.forEach(
        v => {
          if (v) {
            r[v] = isCurrentTable ? params[v] : undefined
          }
        }
      )
      return r
    }
  )
  return params
}

export default useTableParams
