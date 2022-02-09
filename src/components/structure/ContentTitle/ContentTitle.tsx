import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import './ContentTitle.less'

const ContentTitle: FC<{ children?: ReactNode | string }> = ({ children }) =>
  <p className='com-structure-content-title font-bold'>{ children }</p>

export default memo(ContentTitle)
