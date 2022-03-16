import { memo, useEffect, useContext, useState, useRef, useCallback } from 'react'
import type { FC } from 'react'
import './Searcher.less'
import Input from '@/components/form/Input'
import Icon from '@/components/Icon'
import { context } from '../../reducer'

const Searcher: FC = () => {
  const [keyword, setKeyword] = useState('')
  const refKeyword = useRef('')
  const { dispatch, state: { searchString } } = useContext(context)
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
  console.log(dispatch)
  const handleConfirm = useCallback(
    () => {
      dispatch({
        type: 'start search',
        searchString: refKeyword.current
      })
    },
    [dispatch]
  )

  return <Input
    className='com-pop-modal-complex-select--searcher'
    placeholder='搜索'
    value={keyword}
    onInput={handleChange}
    suffix={
      <Icon
        className='com-pop-modal-complex-select--searcher--magnify'
        type='icon-sousuo1'
        onClick={handleConfirm}
      />
    }
    onPressEnter={handleConfirm}
  />
}

export default memo(Searcher)
