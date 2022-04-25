import { memo } from 'react'
import type { FC } from 'react'
import './ResultDept.less'
import Icon from '@/components/Icon'

interface ResultDeptProps {
  name: string
  onRemove: VoidFunction
}

const ResultDept: FC<ResultDeptProps> = ({ name, onRemove }) =>
  <div
    className='com-pop-modal-complex-select--result-dpet ellipsis'
  >
    <Icon
      className='com-pop-modal-complex-select--result-dpet--folder'
      type='icon-bumenzu'
    />
    <p
      className='com-pop-modal-complex-select--result-dpet--name ellipsis' 
    >
      { name }
    </p>
    <Icon
      className='com-pop-modal-complex-select--result-dpet--remove'
      type='icon-shanchu'
      onClick={onRemove}
    />
  </div>

export default memo(ResultDept)
