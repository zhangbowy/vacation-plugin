import { memo, useMemo } from 'react'
import type { FC, MouseEventHandler } from 'react'
import { createFromIconfontCN } from '@ant-design/icons'
import classnames from 'classnames'

const ProjIcon = createFromIconfontCN({
  // @ts-ignore
  scriptUrl: ICONFONT_URL,
})

interface IconProps {
  className?: string
  type: string
  onClick?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onMouseEnter?: MouseEventHandler
  style?: Record<string, string>
}

const Icon: FC<IconProps> = ({
  className,
  type,
  onClick,
  onMouseLeave,
  onMouseEnter,
  style
}) => {
  const cName = useMemo(
    () => classnames('com-icon', className),
    [className]
  )
  return <ProjIcon
      className={cName}
      type={type}
      style={style}
      aria-hidden
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    />
}

export default memo(Icon)
