import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Table as AntdTable } from 'antd'
import type { TableProps } from 'antd'

const Table: FC<TableProps<any>> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-table', className),
    [className]
  )
  return <AntdTable className={cName} {...rest} />
}

export default memo(Table)
