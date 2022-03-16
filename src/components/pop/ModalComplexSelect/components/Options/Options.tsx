import { memo, useContext, useMemo } from 'react'
import type { FC, MouseEvent } from 'react'
import './Options.less'
import Checkbox from '@/components/form/Checkbox'
import { context } from '../../reducer'
import Avatar from '@/components/Avatar'
import Icon from '@/components/Icon'

const Options: FC = () => {
  const { state } = useContext(context)
  const { value, options } = state
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
    () => (userOptions.length > 0 || deptOptions.length > 0) &&
      userOptions.every(v => userMap[v.id]) &&
      deptOptions.every(v => deptMap[v.id]),
    [deptMap, userMap, userOptions, deptOptions]
  )
  const handleChange = () => {
    console.log('click checkbox')
  }
  const gotoNext = () => {
    console.log('go to next')
  }
  return <div className='com-pop-modal-complex-select--options'>
    <Checkbox
      className='com-pop-modal-complex-select--options--check-all'
      checked={isSelectedAll}
    >
      全选
    </Checkbox>
    <div className='com-pop-modal-complex-select--options--content'>
      {
        userOptions.map(
          ({ id, avatar, name }) =>
            <div
              key={id}
              className='com-pop-modal-complex-select--options--user'
            >
              <Checkbox
                className='com-pop-modal-complex-select--options--check-user'
                checked={userMap[id]}
                onChange={handleChange}
              >
                {
                  avatar
                    ? <Avatar
                      className='com-pop-modal-complex-select--options--avatar'
                      avatar={avatar}
                      name={name}
                    />
                    : <p
                      className='com-pop-modal-complex-select--options--avatar-text'
                    >
                      { name ? name.slice(0, 2) : '未知' }
                    </p>
                }
                <p
                  className='com-pop-modal-complex-select--options--name ellipsis' 
                >
                  { name }
                </p>
              </Checkbox>
            </div>
        )
      }
      {
        deptOptions.map(
          ({ id, name }) =>
            <div
              key={id}
              className='com-pop-modal-complex-select--options--dept'
            >
              <Checkbox
                className='com-pop-modal-complex-select--options--check-dept'
                checked={deptMap[id]}
                onChange={handleChange}
              >
                <Icon
                  className='com-pop-modal-complex-select--options--folder'
                  type='icon-bumenzu'
                />
                <p
                  className='com-pop-modal-complex-select--options--name ellipsis' 
                >
                  { name }
                </p>
              </Checkbox>
              <p
                className='com-pop-modal-complex-select--options--button'
                onClick={gotoNext}
              >
                <Icon
                  className='com-pop-modal-complex-select--options--level'
                  type='icon-xiaji'
                />
                <span
                  className='com-pop-modal-complex-select--options--primary-text'
                >
                  下级
                </span>
              </p>
            </div>
        )
      }
    </div>
  </div>
}

export default memo(Options)
