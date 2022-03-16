import { memo, useContext, useEffect } from 'react'
import type { FC } from 'react'
import './OptionBox.less'
import { context } from '../../reducer'
import Searcher from '../Searcher'
import Navi from '../Navi'
import Options from '../Options'

const OptionBox: FC = () => {
  const { dispatch } = useContext(context)
  useEffect(
    () => {
      console.log('dispatch changed', dispatch)
    },
    [dispatch]
  )
  return <div className='com-pop-modal-complex-select--option-box'>
    <p className='com-pop-modal-complex-select--option-box--title'>
      选择：
    </p>
    <div className='com-pop-modal-complex-select--option-box--content'>
      <Searcher />
      <Navi />
      <Options />
    </div>
  </div>
}

export default memo(OptionBox)
