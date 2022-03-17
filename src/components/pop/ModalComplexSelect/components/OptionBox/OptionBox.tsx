import { memo } from 'react'
import type { FC } from 'react'
import './OptionBox.less'
import Searcher from '../Searcher'
import Navi from '../Navi'
import Options from '../Options'

const OptionBox: FC = () =>
  <div className='com-pop-modal-complex-select--option-box'>
    <p className='com-pop-modal-complex-select--option-box--title'>
      选择：
    </p>
    <div className='com-pop-modal-complex-select--option-box--content'>
      <Searcher />
      <Navi />
      <Options />
    </div>
  </div>

export default memo(OptionBox)
