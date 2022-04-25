import { memo } from 'react'
import type { FC } from 'react'
import './OptionUser.less'
import Avatar from '@/components/Avatar'

type E = { target: { checked: boolean } }
interface OptionUserProps {
  checked?: boolean,
  onChange: (e: E) => void,
  avatar?: string,
  name: string
  Comp: any
}

const OptionUser: FC<OptionUserProps> = ({
  checked, onChange, avatar, name, Comp
}) =>
  <div
    className='com-pop-modal-complex-select--options-user'
    >
    <Comp
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
    </Comp>
</div>

export default memo(OptionUser)
