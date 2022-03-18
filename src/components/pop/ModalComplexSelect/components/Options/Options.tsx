import { memo, useContext, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import './Options.less'
import Checkbox from '@/components/form/Checkbox'
import Radio from '@/components/form/Radio'
import { context } from '../../context'
import OptionUser from '../OptionUser'
import OptionsDept from '../OptionsDept'

type E = { target: { checked: boolean } }

const Options: FC = () => {
  const { state, actions, dispatch } = useContext(context)
  const { value, options, searchString, type, selectMode } = state
  const { deptMap, userMap } = useMemo(
    () => {
      const { users = [], departments = [] } = value || {}
      const rUserMap = {}
      users.forEach(
        (v: AddressUser) => {
          rUserMap[v.id] = true
        }
      )
      const rDeptMap = {}
      departments.forEach(
        (v: AddressDept) => {
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
      ? userOptions.length > 0 && userOptions.every((v: AddressUser) => userMap[v.id])
      : (userOptions.length > 0 || deptOptions.length > 0) &&
        userOptions.every((v: AddressUser) => userMap[v.id]) &&
        deptOptions.every((v: AddressDept) => deptMap[v.id]),
    [deptMap, userMap, userOptions, deptOptions, type]
  )
  const handleChangeAll = useCallback(
    ({ target: { checked } }: E) => {
      const { users = [], departments = [] } = options || {}
      if (checked) {
        dispatch({
          type: 'batch add',
          users: users.filter(({ id }: { id: string }) => !userMap[id]),
          departments: type === 'user'
            ? []
            : departments.filter(({ id }: { id: string }) => !deptMap[id])
        })
      } else {
        const optionUsersMap = {}
        const optionDeptsMap = {}
        users.forEach(({ id }: { id: string }) => {
          optionUsersMap[id] = true
        })
        if (type !== 'user') {
          departments.forEach(({ id }: { id: string }) => {
            optionDeptsMap[id] = true
          })
        }
        const {
          users: valueUsers = [], departments: valueDepartments = []
        } = value || {}
        dispatch({
          type: 'update value',
          users: valueUsers.filter(({ id }: { id: string }) => !optionUsersMap[id]),
          departments: type === 'user'
            ? []
            : valueDepartments.filter(({ id }: { id: string }) => !optionDeptsMap[id])
        })
      }
    },
    [dispatch, options, deptMap, userMap, value, type]
  )
  const handleChangeDept = useCallback(
    (item, checked) => {
      if (selectMode === 'single') {
        dispatch({
          type: 'set item',
          value: checked
            ? { departments: [{ ...item }], users: [] }
            : { departments: [], users: [] }
        })
      } else {
        if (checked) {
          dispatch({
            type: 'add item',
            itemType: 'dept',
            item
          })
        } else {
          const { departments = [] } = value || {}
          const index = departments.findIndex(({ id }: { id: string }) => id === item.id)
          if (~index) {
            dispatch({
              type: 'remove item',
              itemType: 'dept',
              index
            })
          }
        }
      }
    },
    [dispatch, value, selectMode]
  )
  const handleChangeUser = useCallback(
    (item, checked) => {
      if (selectMode === 'single') {
        dispatch({
          type: 'set item',
          value: checked
            ? { departments: [], users: [{ ...item }] }
            : { departments: [], users: [] }
        })
      } else {
        if (checked) {
          dispatch({
            type: 'add item',
            itemType: 'user',
            item
          })
        } else {
          const { users = [] } = value || {}
          const index = users.findIndex(({ id }: { id: string }) => id === item.id)
          if (~index) {
            dispatch({
              type: 'remove item',
              itemType: 'user',
              index
            })
          }
        }
      }
    },
    [dispatch, value, selectMode]
  )
  const openDept = useCallback(
    dept => {
      actions.openDept(dept)
    },
    [actions]
  )
  const Comp = useMemo(
    () => selectMode === 'single' ? Radio : Checkbox,
    [selectMode]
  )
  if (!userOptions.length && !deptOptions.length) {
    return <p className='com-pop-modal-complex-select--options--empty'>
      { searchString ? '没有搜索到结果' : '暂无数据' }
    </p>
  }
  return <div className='com-pop-modal-complex-select--options'>
    {
      selectMode !== 'single' &&
      <Checkbox
        className='com-pop-modal-complex-select--options--check-all'
        checked={isSelectedAll}
        onChange={handleChangeAll}
      >
        全选
      </Checkbox>
    }
    <div className='com-pop-modal-complex-select--options--content'>
      {
        deptOptions.map(
          ({ id, name }: { id: string, name: string }) =>
            <OptionsDept
              key={id}
              checked={deptMap[id]}
              onChange={(e: E) => handleChangeDept(
                { id, name }, e.target.checked
              )}
              onOpen={() => openDept({ id, name })}
              name={name}
              showOption={type !== 'user'}
              Comp={Comp}
            />
        )
      }
      {
        type !== 'dept' && userOptions.map(
          ({ id, avatar, name }: { id: string, name: string, avatar: string }) =>
            <OptionUser
              key={id}
              checked={userMap[id]}
              onChange={(e: E) => handleChangeUser(
                { id, avatar, name }, e.target.checked
              )}
              avatar={avatar}
              name={name}
              Comp={Comp}
            />
        )
      }
    </div>
  </div>
}

export default memo(Options)
