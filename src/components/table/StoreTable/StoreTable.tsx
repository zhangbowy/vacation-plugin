import { memo, useMemo } from 'react'
import type { FC } from 'react'
import './StoreTable.less'
import FooterPagination from '@/components/table/FooterPagination'
import Table from '@/components/table/Table'
import { useSelector } from 'dva'

interface StoreTableProps {
  rowKey?: string | ((record: any) => string)
  withFooterPaination?: boolean
  bordered?: boolean
  tableLayout?: 'auto' | 'fixed'
  name: string
}

const StoreTable: FC<StoreTableProps> = ({
  rowKey, withFooterPaination, bordered, tableLayout = 'fixed', name
}) => {
  const {
    columns, list, pageNo, pageSize, total, name: tableName
  } = useSelector(state => state.table)
  const dataSource = useMemo(
    () => {
      if (name) {
        if (name === tableName) {
          return list
        }
        return []
      } else {
        return list
      }
    },
    [name, tableName, list]
  )
  return <>
    <Table
      className='com-table--store'
      tableLayout={tableLayout}
      rowKey={rowKey}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered={bordered}
    />
    {
      withFooterPaination &&
      <FooterPagination pageNo={pageNo} pageSize={pageSize} total={total} />
    }
  </>
}

export default memo(StoreTable)
