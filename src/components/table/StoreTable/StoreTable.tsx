import { memo, useMemo } from 'react'
import type { FC } from 'react'
import './StoreTable.less'
import classnames from 'classnames'
import FooterPagination from '@/components/table/FooterPagination'
import Table from '@/components/table/Table'
import { useSelector } from 'dva'

interface StoreTableProps {
  className?: string
  rowKey?: string | ((record: any) => string)
  withFooterPagination?: boolean
  bordered?: boolean
  tableLayout?: 'auto' | 'fixed'
  name: string
  scroll?: any
}

const StoreTable: FC<StoreTableProps> = ({
  rowKey,
  withFooterPagination,
  bordered,
  tableLayout = 'fixed',
  name,
  scroll,
  className
}) => {
  const {
    columns, list, pageNo, pageSize, total, name: tableName
  } = useSelector(state => state.table)
  const { dataSource, showPagination } = useMemo(
    () => {
      if (name) {
        if (name === tableName) {
          return { dataSource: list, showPagination: withFooterPagination }
        }
        return { dataSource: [], showPagination: false }
      } else {
        return { dataSource: list, showPagination: withFooterPagination }
      }
    },
    [name, tableName, list, withFooterPagination]
  )
  const cName = useMemo(
    () => classnames('com-table--store', className),
    [className]
  )
  return <>
    <Table
      className={cName}
      tableLayout={tableLayout}
      rowKey={rowKey}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered={bordered}
      scroll={scroll}
    />
    {
      showPagination &&
      <FooterPagination pageNo={pageNo} pageSize={pageSize} total={total} />
    }
  </>
}

export default memo(StoreTable)
