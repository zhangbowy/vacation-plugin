import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import Modal from '../Modal'
import type { ModalProps as AntdModalProps } from 'antd'
import Icon from '@/components/Icon'
import './CommonModal.less'

interface CommonModalProps extends AntdModalProps {
  children: any
}

const CommonModal: FC<CommonModalProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-pop-common-modal', className),
    [className]
  )
  return <Modal
    className={cName}
    closeIcon={
      <Icon
        className='com-pop-common-modal--close-icon'
        type='icon-guanbi'
      />
    }
    {...rest}
  />
}

export default memo(CommonModal)
