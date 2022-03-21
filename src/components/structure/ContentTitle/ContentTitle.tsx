import { memo, useMemo, useCallback } from 'react'
import type { FC, ReactNode } from 'react'
import classnames from 'classnames'
import { history } from 'umi'
import './ContentTitle.less'
import Icon from '@/components/Icon'
import config from '@/config'

interface ContentTitleProps {
  className?: string
  children?: ReactNode | string
  onClick?: VoidFunction
  hasReturn?: boolean
}

const ContentTitle: FC<ContentTitleProps> = ({
  className, children, onClick, hasReturn = config.inH5
}) => {
  const cName = useMemo(
    () => classnames(
      'com-structure-content-title font-bold',
      { 'has-return': hasReturn },
      className
    ),
    [className, hasReturn]
  )
  const handleReturn = useCallback(
    () => {
      if (onClick) {
        onClick()
      } else {
        history.goBack()
      }
    },
    [onClick]
  )
  if (hasReturn) {
    return <p className={cName} onClick={handleReturn}>
      {
        hasReturn &&
        <Icon
          className='com-structure-content-title--icon'
          type='icon-fanhui'
        />
      }
      <span>{ children }</span>
    </p>
  }
  return <p className={cName} onClick={onClick}>
    { children }
  </p>
}

export default memo(ContentTitle)
