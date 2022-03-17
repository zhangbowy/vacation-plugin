import { memo } from 'react'
import type { FC } from 'react'
import './OptionUser.less'
import Checkbox from '@/components/form/Checkbox'
import Avatar from '@/components/Avatar'

type E = { target: { checked: boolean } }
interface OptionUserProps {
  checked?: boolean,
  onChange: (e: E) => void,
  avatar?: string,
  name: string
}

const OptionUser: FC<OptionUserProps> = ({ checked, onChange, avatar, name }) =>
  <div
    className='com-pop-modal-complex-select--options-user'
    >
    <Checkbox
      className='com-pop-modal-complex-select--options-user--check'
      checked={checked}
      onChange={onChange}
    >
      {
        avatar
          ? <Avatar
            className='com-pop-modal-complex-select--options-user--avatar'
            avatar={avatar}
            name={name}
          />
          : <p
            className='com-pop-modal-complex-select--options-user--avatar-text'
          >
            { name ? name.slice(0, 2) : '未知' }
          </p>
      }
      <p
        className='com-pop-modal-complex-select--options-user--name ellipsis' 
      >
        { name }
      </p>
    </Checkbox>
</div>

export default memo(OptionUser)
