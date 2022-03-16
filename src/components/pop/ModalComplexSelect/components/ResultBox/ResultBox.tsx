import { memo, useContext, useMemo } from 'react'
import type { FC } from 'react'
import './ResultBox.less'
import Avatar from '@/components/Avatar'
import Icon from '@/components/Icon'
import { context } from '../../reducer'

interface ValueProps {
  departments: { id: string, name: string }[]
  users: { id: string, name: string, avatar?: string }[]
}

const ResultBox: FC = () => {
  const { state: { value } } = useContext(context)
  const { departments = [], users = [] } = useMemo<ValueProps>(
    () => value || { departments: [], users: [] },
    [value]
  )
  return <div className='com-pop-modal-complex-select--result-box'>
    <p className='com-pop-modal-complex-select--result-box--title'>
      已选：
    </p>
    <div className='com-pop-modal-complex-select--result-box--content'>
      {
        departments.map(
          ({ id, name }) =>
            <div
              key={id}
              className='com-pop-modal-complex-select--result-box--dpet ellipsis'
            >
              <Icon
                className='com-pop-modal-complex-select--result-box--folder'
                type='icon-bumenzu'
              />
              <p
                className='com-pop-modal-complex-select--result-box--name ellipsis' 
              >
                { name }
              </p>
              <Icon
                className='com-pop-modal-complex-select--result-box--remove'
                type='icon-shanchu'
              />
            </div>
        )
      }
      {
        users.map(
          ({ id, name, avatar }) =>
            <div
              key={id}
              className='com-pop-modal-complex-select--result-box--user ellipsis'
            >
              {
                avatar
                  ? <Avatar
                    className='com-pop-modal-complex-select--result-box--avatar'
                    avatar={avatar}
                    name={name}
                  />
                  : <p
                    className='com-pop-modal-complex-select--result-box--avatar-text'
                  >
                    { name ? name.slice(0, 2) : '未知' }
                  </p>
              }
              <p
                className='com-pop-modal-complex-select--result-box--name ellipsis' 
              >
                { name }
              </p>
              <Icon
                className='com-pop-modal-complex-select--result-box--remove'
                type='icon-shanchu'
              />
            </div>
        )
      }
    </div>
  </div>
}

export default memo(ResultBox)
