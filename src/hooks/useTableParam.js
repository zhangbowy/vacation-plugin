import { useSelector } from 'dva'

const useTableParam = (paramName, tableName) => {
  const value = useSelector(
    state => {
      if (!paramName) {
        return undefined
      }
      const { name, params } = state.table
      const isCurrentTable = !tableName || name === tableName
      return isCurrentTable ? params[paramName] : undefined
    }
  )
  return value
}

export default useTableParam
