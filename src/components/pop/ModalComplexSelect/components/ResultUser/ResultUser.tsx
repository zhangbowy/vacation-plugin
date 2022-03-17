import { memo } from 'react'
import type { FC } from 'react'
import './ResultUser.less'
import Avatar from '@/components/Avatar'
import Icon from '@/components/Icon'

interface ResultUserProps {
  name: string
  avatar?: string
  onRemove: VoidFunction
}

const ResultUser: FC<ResultUserProps> = ({ name, avatar, onRemove }) =>
  <div
    className='com-pop-modal-complex-select--result-user ellipsis'
  >
    {
      avatar
        ? <Avatar
          className='com-pop-modal-complex-select--result-user--avatar'
          avatar={avatar}
          name={name}
        />
        : <p
          className='com-pop-modal-complex-select--result-user--avatar-text'
        >
          { name ? name.slice(0, 2) : '未知' }
        </p>
    }
    <p
      className='com-pop-modal-complex-select--result-user--name ellipsis' 
    >
      { name }
    </p>
    <Icon
      className='com-pop-modal-complex-select--result-user--remove'
      type='icon-shanchu'
      onClick={onRemove}
    />
  </div>

export default memo(ResultUser)
