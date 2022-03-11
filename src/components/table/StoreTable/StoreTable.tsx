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
  scroll?: any,
  onRow?: (record: any) => any
}

const StoreTable: FC<StoreTableProps> = ({
  rowKey,
  withFooterPagination,
  bordered,
  tableLayout = 'fixed',
  name,
  scroll,
  className,
  onRow
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
  const dispColumns = useMemo(
    () => {
      if (columns && Array.isArray(columns)) {
        return columns.map(
          v => {
            //@ts-ignore
            if (!v.render) {
              return {
                ...v,
                render: (x: any) => x === 0 || x ? x : '-'
              }
            }
            return v
          }
        )
      }
      return columns
    },
    [columns]
  )
  return <>
    <Table
      className={cName}
      tableLayout={tableLayout}
      rowKey={rowKey}
      columns={dispColumns}
      dataSource={dataSource}
      pagination={false}
      bordered={bordered}
      scroll={scroll}
      onRow={onRow}
    />
    {
      showPagination &&
      <FooterPagination pageNo={pageNo} pageSize={pageSize} total={total} />
    }
  </>
}

export default memo(StoreTable)
