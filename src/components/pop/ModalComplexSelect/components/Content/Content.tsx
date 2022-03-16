import { memo, useMemo, useEffect, useContext, useCallback } from 'react'
import type { FC } from 'react'
import './Content.less'
import Modal from '@/components/pop/Modal'
import OptionBox from '../OptionBox'
import ResultBox from '../ResultBox'
import { context } from '../../reducer'

interface ContentProps {
  title?: string
  topName?: string
  type?: 'complex' | 'user' | 'dept'
  options?: any[]
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

const tstOptions = {
  departments: [
    {
      id: '1', name: '测试部'
    }, {
      id: '2', name: '技术部'
    }, {
      id: '3', name: '测试部'
    }, {
      id: '4', name: '技术部'
    }, {
      id: '5', name: '测试部'
    }, {
      id: '6', name: '技术部'
    }
  ],
  users: [
    {
      id: '1',
      name: '测试部',
      avatar: 'https://gw.alicdn.com/tps/TB1W_X6OXXXXXcZXVXXXXXXXXXX-400-400.png'
    }, {
      id: '2', name: '技术部'
    }
  ]
}
const tstValue = {
  departments: [
    {
      id: '1', name: '测试部'
    }, {
      id: '2', name: '技术部'
    }
  ],
  users: [
    {
      id: '1',
      name: '测试部',
      avatar: 'https://gw.alicdn.com/tps/TB1W_X6OXXXXXcZXVXXXXXXXXXX-400-400.png'
    }, {
      id: '2', name: '技术部'
    }
  ]
}

const Content: FC<ContentProps> = ({
  title,
  type = 'complex',
  options,
  value,
  topName,
  onChange,
  visible = true
}) => {
  const { dispatch } = useContext(context)
  useEffect(
    () => {
      dispatch({
        type: 'reset',
        payload: {
          topName: '考勤打卡',
          options: options || tstOptions,
          value: value || tstValue,
          type: 'user'
        }
      })
    },
    [options, value, type, topName, dispatch]
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
