import { memo } from 'react'
import type { FC } from 'react'
import './OptionsDept.less'
import Checkbox from '@/components/form/Checkbox'
import Icon from '@/components/Icon'

type E = { target: { checked: boolean } }
interface OptionsDeptProps {
  checked: boolean
  onChange: (e: E) => void
  onOpen: VoidFunction
  name: string
  showCheckbox: boolean
}

const OptionsDept: FC<OptionsDeptProps> = ({
  checked, onChange, onOpen, name, showCheckbox
}) =>
  <div
    className='com-pop-modal-complex-select--options-dept'
  >
    {
      showCheckbox
        ? <Checkbox
          className='com-pop-modal-complex-select--options-dept--check'
          checked={checked}
          onChange={onChange}
        >
          <Icon
            className='com-pop-modal-complex-select--options-dept--folder'
            type='icon-bumenzu'
          />
          <p
            className='com-pop-modal-complex-select--options-dept--name ellipsis' 
          >
            { name }
          </p>
        </Checkbox>
      : <div className='com-pop-modal-complex-select--options-dept--topic'>
        <Icon
          className='com-pop-modal-complex-select--options-dept--topic-folder'
          type='icon-bumenzu'
        />
        <p
          className='com-pop-modal-complex-select--options-dept--topic-name ellipsis' 
        >
          { name }
        </p>
      </div>
    }
    <p
      className='com-pop-modal-complex-select--options-dept--button'
      onClick={onOpen}
    >
      <Icon
        className='com-pop-modal-complex-select--options-dept--level'
        type='icon-xiaji'
      />
      <span
        className='com-pop-modal-complex-select--options-dept--primary-text'
      >
        下级
      </span>
    </p>
  </div>

export default memo(OptionsDept)
