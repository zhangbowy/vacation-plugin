import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import pngEmpty from '@/assets/empty.png'
import './Empty.less'

interface EmptyProps {
  text: string
  className?: string
}

const Empty: FC<EmptyProps> = ({ text, className }) => {
  const cName = useMemo(
    () => classnames('com-empty', className),
    [className]
  )
  return <div className={cName}>
    <img className='com-empty--image' src={pngEmpty} />
    <p className='com-empty--text'>{ text }</p>
  </div>
}

export default memo(Empty)
