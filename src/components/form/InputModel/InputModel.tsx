import { memo, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { FC } from 'react'
import './InputModel.less'
import classnames from 'classnames'
import Input from '@/components/form/Input'
import { useDebounceFn } from 'ahooks';
import { useSelector, useDispatch } from 'dva'
import type { InputProps } from 'antd'

const isLegalValue = {
  number: true, string: true
}

interface InputModelProps extends InputProps {
  tableName?: string
}

const InputModel: FC<InputModelProps> = ({ className, name, tableName, ...rest }) => {
  const refInputValue = useRef('')
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState<string>('')
  const { storeValue, currentTableName } = useSelector(
    state => ({
      storeValue: name ? state.table.params[name] : '',
      currentTableName: state.table.name
    })
  )
  const { run, flush } = useDebounceFn(
    (propName: string | undefined, value: string) => {
      if (propName) {
        dispatch({
          type: 'table/updateParams',
          params: { [propName]: value }
        })
      }
    },
    { wait: 1000 }
  )
  useEffect(
    () => {
      const value = !tableName || tableName === currentTableName
        ? storeValue
        : undefined
      const vType =  typeof value
      if (
        isLegalValue[vType] &&
        refInputValue.current !== value
      ) {
        const newValue = vType === 'number'
          // @ts-ignore
          ? value.toString()
          : value
        refInputValue.current = newValue
        setInputValue(newValue)
        run(name, newValue)
      }
    },
    [storeValue, name, run, tableName, currentTableName]
  )
  const handleChange = useCallback(
    (e: any) => {
      const v = e.target.value
      setInputValue(v)
      refInputValue.current = v
      run(name, v)
    },
    [run, name]
  )
  const handlePressEnter = useCallback(
    () => {
      flush()
    },
    [flush]
  )
  const cName = useMemo(
    () => classnames('com-form-input-model', className),
    [className]
  )
  return <Input
    {...rest}
    className={cName}
    value={inputValue}
    onChange={handleChange}
    onPressEnter={handlePressEnter}
  />
}

export default memo(InputModel)
