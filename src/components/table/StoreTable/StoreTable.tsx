import { memo } from 'react'
import type { FC } from 'react'
import './StoreTable.less'
import FooterPagination from '@/components/table/FooterPagination'
import Table from '@/components/table/Table'
import { useSelector } from 'dva'

interface StoreTableProps {
  withFooterPaination: boolean
  bordered?: boolean
}

const StoreTable: FC<StoreTableProps> = ({ withFooterPaination, bordered }) => {
  const {
    columns, list, pageNo, pageSize, total
  } = useSelector(state => state.table)
  return <>
    <Table
      className='com-table--store'
      columns={columns}
      dataSource={list}
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
