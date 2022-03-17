import { memo, useMemo, useEffect, useContext, useCallback } from 'react'
import type { FC } from 'react'
import './Content.less'
import Modal from '@/components/pop/Modal'
import OptionBox from '../OptionBox'
import ResultBox from '../ResultBox'
import { context } from '../../context'

type Dept = { id: string, name: string }
type Depts = Dept[]
type User = { id: string, name: string, avatar?: string }
type Users = User[]
interface ContentProps {
  title?: string
  topName?: string
  type?: 'complex' | 'user' | 'dept'
  value?: {
    departments: Depts,
    users: Users
  }
  onChange?: (x: {
    departments: Depts,
    users: Users
  }) => void
  visible?: boolean
  onCancel?: VoidFunction
  onConfirm?: VoidFunction
}

const getDefaultTitle = (type: string) => {
  if (type === 'user') {
    return '选择人员'
  } else if (type === 'dept') {
    return '选择部门'
  }
  return '选择部门与人员'
}

const tstTopName = 'xz考勤测试使用'

const Content: FC<ContentProps> = ({
  title,
  type = 'complex',
  value,
  topName,
  onChange,
  onConfirm,
  onCancel,
  visible = true
}) => {
  const {
    actions, dispatch, state: { value: stateValue }
  } = useContext(context)
  useEffect(
    () => {
      actions.getList()
    },
    [type, actions]
  )
  useEffect(
    () => {
      const  { departments = [], users = [] } = value || {}
      dispatch({
        type: 'reset',
        payload: {
          topName: topName || tstTopName,
          value: {
            departments: type !== 'user' ? departments : [],
            users: type !== 'dept' ? users : []
          },
          type
        }
      })
    },
    [value, type, topName, dispatch]
  )
  const dispTitle = useMemo<string>(
    () => {
      if (title) {
        return title
      }
      return getDefaultTitle(type)
    },
    [title, type]
  )
  const handleConfirm = useCallback(
    () => {
      if (onChange) {
        onChange(stateValue)
      }
      if (onConfirm) {
        onConfirm()
      } else if (onCancel) {
        onCancel()
      }
    },
    [onChange, onConfirm, onCancel, stateValue]
  )
  const handleClose = useCallback(
    () => {
      if (onCancel) {
        onCancel()
      }
    },
    [onCancel]
  )
  return <Modal
    className='com-pop-modal-complex-select--content'
    visible={visible}
    closable={false}
    title={dispTitle}
    width={700}
    onOk={handleConfirm}
    onCancel={handleClose}
  >
    <OptionBox />
    <ResultBox />
  </Modal>
}

export default memo(Content)
