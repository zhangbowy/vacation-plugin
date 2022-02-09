import { memo, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import classnames from 'classnames'
import './PageContent.less'

interface PageContentProps {
  children?: ReactNode
  className?: string
  hasPadding?: boolean
}

const PageContent: FC<PageContentProps> = ({ children, className, hasPadding }) => {
  const mainName = useMemo(
    () => classnames(
      className,
      'com-structure-page-content',
      {
        'has-padding': hasPadding
      }
    ),
    [className, hasPadding]
  )
  return <div className={mainName}>
    { children }
  </div>
}

export default memo(PageContent)
