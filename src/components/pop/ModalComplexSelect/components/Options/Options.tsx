import { memo, useContext, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import './Options.less'
import Checkbox from '@/components/form/Checkbox'
import { context } from '../../context'
import OptionUser from '../OptionUser'
import OptionsDept from '../OptionsDept'

type E = { target: { checked: boolean } }

const Options: FC = () => {
  const { state, actions, dispatch } = useContext(context)
  const { value, options, searchString, type } = state
  const { deptMap, userMap } = useMemo(
    () => {
      const { users = [], departments = [] } = value || {}
      const rUserMap = {}
      users.forEach(
        v => {
          rUserMap[v.id] = true
        }
      )
      const rDeptMap = {}
      departments.forEach(
        v => {
          rDeptMap[v.id] = true
        }
      )
      return { deptMap: rDeptMap, userMap: rUserMap }
    },
    [value]
  )
  const { userOptions, deptOptions } = useMemo(
    () => {
      const { users = [], departments = [] } = options || {}
      return {
        userOptions: users, deptOptions: departments
      }
    },
    [options]
  )
  const isSelectedAll = useMemo(
    () => type === 'user'
      ? userOptions.length > 0 && userOptions.every(v => userMap[v.id])
      : (userOptions.length > 0 || deptOptions.length > 0) &&
        userOptions.every(v => userMap[v.id]) &&
        deptOptions.every(v => deptMap[v.id]),
    [deptMap, userMap, userOptions, deptOptions, type]
  )
  const handleChangeAll = useCallback(
    ({ target: { checked } }: E) => {
      const { users = [], departments = [] } = options || {}
      if (checked) {
        dispatch({
          type: 'batch add',
          users: users.filter(({ id }) => !userMap[id]),
          departments: type === 'user'
            ? []
            : departments.filter(({ id }) => !deptMap[id])
        })
      } else {
        const optionUsersMap = {}
        const optionDeptsMap = {}
        users.forEach(({ id }) => {
          optionUsersMap[id] = true
        })
        if (type !== 'user') {
          departments.forEach(({ id }) => {
            optionDeptsMap[id] = true
          })
        }
        const {
          users: valueUsers = [], departments: valueDepartments = []
        } = value || {}
        dispatch({
          type: 'update value',
          users: valueUsers.filter(({ id }) => !optionUsersMap[id]),
          departments: type === 'user'
            ? []
            : valueDepartments.filter(({ id }) => !optionDeptsMap[id])
        })
      }
    },
    [dispatch, options, deptMap, userMap, value, type]
  )
  const handleChangeDept = useCallback(
    (item, checked) => {
      if (checked) {
        dispatch({
          type: 'add item',
          itemType: 'dept',
          item
        })
      } else {
        const { departments = [] } = value || {}
        const index = departments.findIndex(({ id }) => id === item.id)
        if (~index) {
          dispatch({
            type: 'remove item',
            itemType: 'dept',
            index
          })
        }
      }
    },
    [dispatch, value]
  )
  const handleChangeUser = useCallback(
    (item, checked) => {
      if (checked) {
        dispatch({
          type: 'add item',
          itemType: 'user',
          item
        })
      } else {
        const { users = [] } = value || {}
        const index = users.findIndex(({ id }) => id === item.id)
        if (~index) {
          dispatch({
            type: 'remove item',
            itemType: 'user',
            index
          })
        }
      }
    },
    [dispatch, value]
  )
  const openDept = useCallback(
    dept => {
      actions.openDept(dept)
    },
    [actions]
  )
  if (!userOptions.length && !deptOptions.length) {
    return <p className='com-pop-modal-complex-select--options--empty'>
      { searchString ? '没有搜索到结果' : '暂无数据' }
    </p>
  }
  return <div className='com-pop-modal-complex-select--options'>
    <Checkbox
      className='com-pop-modal-complex-select--options--check-all'
      checked={isSelectedAll}
      onChange={handleChangeAll}
    >
      全选
    </Checkbox>
    <div className='com-pop-modal-complex-select--options--content'>
      {
        deptOptions.map(
          ({ id, name }) =>
            <OptionsDept
              key={id}
              checked={deptMap[id]}
              onChange={(e: E) => handleChangeDept(
                { id, name }, e.target.checked
              )}
              onOpen={() => openDept({ id, name })}
              name={name}
              showCheckbox={type !== 'user'}
            />
        )
      }
      {
        type !== 'dept' && userOptions.map(
          ({ id, avatar, name }) =>
            <OptionUser
              key={id}
              checked={userMap[id]}
              onChange={(e: E) => handleChangeUser(
                { id, avatar, name }, e.target.checked
              )}
              avatar={avatar}
              name={name}
            />
        )
      }
    </div>
  </div>
}

export default memo(Options)
