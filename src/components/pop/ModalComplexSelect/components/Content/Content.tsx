import { memo, useMemo, useEffect, useContext, useCallback } from 'react'
import type { FC } from 'react'
import './Content.less'
import Modal from '@/components/pop/Modal'
import OptionBox from '../OptionBox'
import ResultBox from '../ResultBox'
import { context } from '../../context'

interface ContentProps {
  title?: string
  topName?: string
  type?: 'complex' | 'user' | 'dept'
  value?: any[]
  onChange?: VoidFunction
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
  visible = true
}) => {
  const { actions, dispatch } = useContext(context)
  useEffect(
    () => {
      actions.getList()
    },
    [type, actions]
  )
  useEffect(
    () => {
      dispatch({
        type: 'reset',
        payload: {
          topName: topName || tstTopName,
          value: value || { departments: [], users: [] },
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
      console.log('click confirm')
      console.log('onChange', onChange)
    },
    [onChange]
  )
  const handleClose = () => {
    console.log('click close')
  }
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
