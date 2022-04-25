import { memo, useContext, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import './ResultBox.less'
import { context } from '../../context'
import ResultDept from '../ResultDept'
import ResultUser from '../ResultUser'

interface ValueProps {
  departments: { id: string, name: string }[]
  users: { id: string, name: string, avatar?: string }[]
}

const ResultBox: FC = () => {
  const { state: { value }, dispatch } = useContext(context)
  const { departments = [], users = [] } = useMemo<ValueProps>(
    () => value || { departments: [], users: [] },
    [value]
  )
  const handleRemovDept = useCallback(
    index => {
      dispatch({
        type: 'remove item',
        index,
        itemType: 'dept'
      })
    },
    [dispatch]
  )
  const handleRemoveUser = useCallback(
    index => {
      dispatch({
        type: 'remove item',
        index,
        itemType: 'user'
      })
    },
    [dispatch]
  )
  return <div className='com-pop-modal-complex-select--result-box'>
    <p className='com-pop-modal-complex-select--result-box--title'>
      已选：
    </p>
    <div className='com-pop-modal-complex-select--result-box--content'>
      {
        departments.map(
          ({ id, name }, i) =>
            <ResultDept
              key={id}
              name={name}
              onRemove={() => { handleRemovDept(i) }}
            />
        )
      }
      {
        users.map(
          ({ id, name, avatar }, i) =>
            <ResultUser
              key={id}
              name={name}
              avatar={avatar}
              onRemove={() => { handleRemoveUser(i) }}
            />
        )
      }
    </div>
  </div>
}

export default memo(ResultBox)
