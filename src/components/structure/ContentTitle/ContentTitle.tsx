import { memo, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import classnames from 'classnames'
import './ContentTitle.less'

interface ContentTitleProps {
  className?: string
  children?: ReactNode | string
  onClick?: VoidFunction
}

const ContentTitle: FC<ContentTitleProps> = ({
  className, children, onClick
}) => {
  const cName = useMemo(
    () => classnames('com-structure-content-title font-bold', className),
    [className]
  )
  return <p className={cName} onClick={onClick}>{ children }</p>
}

export default memo(ContentTitle)
