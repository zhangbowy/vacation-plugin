import { memo, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import classnames from 'classnames'
import './ContentTitle.less'

interface ContentTitleProps {
  className?: string
  children?: ReactNode | string
}

const ContentTitle: FC<ContentTitleProps> = ({ className, children }) => {
  const cName = useMemo(
    () => classnames('com-structure-content-title font-bold', className),
    [className]
  )
  return <p className={cName}>{ children }</p>
}

export default memo(ContentTitle)
