import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'dva'
import type { ComponentType } from 'react'

const defaultGetValue = (type: string, e: any) => {
  if (type === 'targetValue') {
    return e.target.value
  }
  return e
}

const hocFilter = <P extends object>(
  WrappedComponent: ComponentType<P>,
  {
    name,
    getValue,
    getValueType,
    propValue = 'value',
    propOnChange = 'onChange',
    tableName
  }: {
    name: string,
    getValue?: (v: any) => void,
    getValueType?: string,
    propValue?: string,
    propOnChange?: string,
    tableName?: string
  }
) =>
  (props: any) => {
    const dispatch = useDispatch()
    const { value, currentTableName } = useSelector(
      state => ({
        value: state.table.params[name],
        currentTableName: state.table.name
      })
    )
    const handleChange = useCallback(
      (v: any) => {
        const newValue = getValue
          ? getValue(v)
          : getValueType ? defaultGetValue(getValueType, v) : v
        dispatch({
          type: 'table/updateParams',
          params: { [name]: newValue }
        })
      },
      [dispatch]
    )
    const otherProps = useMemo(
      () => ({
        [propValue]: !tableName || tableName === currentTableName
          ? value
          : undefined,
        [propOnChange]: handleChange
      }),
      [value, handleChange, currentTableName]
    )
    return <WrappedComponent {...props} {...otherProps} />
  }

export default hocFilter
