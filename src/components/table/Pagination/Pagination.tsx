import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Pagination as AntdPagination } from 'antd'
import type { PaginationProps } from 'antd'

const Pagination: FC<PaginationProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-table-pagination', className),
    [className]
  )
  return <AntdPagination className={cName} {...rest} />
}

export default memo(Pagination)
