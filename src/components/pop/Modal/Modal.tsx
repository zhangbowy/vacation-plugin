import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Modal as AntdModal } from 'antd'
import type { ModalProps as AntdModalProps } from 'antd'

interface ModalProps extends AntdModalProps {
  children: any
}

const Modal: FC<ModalProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-pop-modal', className),
    [className]
  )
  return <AntdModal className={cName} {...rest} />
}

export default memo(Modal)
