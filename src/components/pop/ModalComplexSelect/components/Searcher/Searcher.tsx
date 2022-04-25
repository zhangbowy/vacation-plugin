import { memo, useEffect, useContext, useState, useRef, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import './Searcher.less'
import Input from '@/components/form/Input'
import Icon from '@/components/Icon'
import { context } from '../../context'

const Searcher: FC = () => {
  const [keyword, setKeyword] = useState('')
  const refKeyword = useRef('')
  const { actions, state: { searchString } } = useContext(context)
  useEffect(
    () => {
      if (refKeyword.current !== searchString) {
        refKeyword.current = searchString
        setKeyword(searchString)
      }
    },
    [searchString]
  )
  const handleChange = (v: any) => {
    const { target } = v
    refKeyword.current = target.value
    setKeyword(target.value)
  }
  const handleConfirm = useCallback(
    () => {
      actions.doSearch(refKeyword.current)
    },
    [actions]
  )
  const handleClear = useCallback(
    () => {
      refKeyword.current = ''
      setKeyword('')
      actions.doSearch('')
    },
    [actions]
  )
  const suffix = useMemo(
    () => {
      if (searchString) {
        return <Icon
          className='com-pop-modal-complex-select--searcher--clear'
          type='icon-qingkong_mian'
          onClick={handleClear}
        />
      }
      return <Icon
        className='com-pop-modal-complex-select--searcher--magnify'
        type='icon-sousuo1'
        onClick={handleConfirm}
      />
    },
    [searchString, handleConfirm, handleClear]
  )

  return <Input
    className='com-pop-modal-complex-select--searcher'
    placeholder='搜索'
    value={keyword}
    onInput={handleChange}
    suffix={suffix}
    onPressEnter={handleConfirm}
  />
}

export default memo(Searcher)
