import { useCallback, useMemo } from 'react'
import { useDispatch } from 'dva'
import type { ComponentType } from 'react'
import useTableParam from '@/hooks/useTableParam'

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
    const value = useTableParam(name, tableName)
    const otherProps = useMemo(
      () => ({
        [propValue]: value,
        [propOnChange]: handleChange
      }),
      [value, handleChange]
    )
    return <WrappedComponent {...props} {...otherProps} />
  }

export default hocFilter
