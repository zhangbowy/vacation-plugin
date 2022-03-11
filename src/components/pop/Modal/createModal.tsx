import { Modal } from 'antd'
import Icon from '@/components/Icon'
import classnames from 'classnames'
import './createModal.less'

export const createSuccess = (props?: Record<string, any>) =>
  Modal.success({
    className: props
      ? classnames('com-pop-modal-success', props.className)
      : 'com-pop-modal-success',
    okText: '我知道了',
    icon: <Icon type='icon-Check-Circle-Fill' />,
    ...(props || {})
  })

export const createError = (props?: Record<string, any>) =>
  Modal.error({
    className: props
      ? classnames('com-pop-modal-error', props.className)
      : 'com-pop-modal-error',
    okText: '我知道了',
    icon: <Icon type='icon-Close-Circle-Fill' />,
    ...(props || {})
  })

export default null