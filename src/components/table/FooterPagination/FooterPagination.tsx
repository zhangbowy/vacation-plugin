import { memo } from 'react'
import type { FC } from 'react'
import ContentFooter from '@/components/structure/ContentFooter'
import './FooterPagination.less'
import Pagination from '@/components/table/Pagination'

interface FooterPaginationProps {
  pageNo?: number
  total?: number
  pageSize?: number
}

const totalFunction = (total: number) => `共${total}项`

const FooterPagination: FC<FooterPaginationProps> = ({
  pageNo = 1, total = 0, pageSize = 10
}) => {
  console.log('aa', pageNo, total, pageSize)
  const handlePageChange = pageInfo => {
    console.log('pageinfo')
  }
  if (total > 0) {
    return <ContentFooter className='com-table-footer-paination'>
      <Pagination
        pageSize={pageSize}
        total={total}
        current={pageNo}
        showTotal={totalFunction}
        onChange={handlePageChange}
        showSizeChanger
        showQuickJumper
      />
    </ContentFooter>
  }
  return null
}

export default memo(FooterPagination)
