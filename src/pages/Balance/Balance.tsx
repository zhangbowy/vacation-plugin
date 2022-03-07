import { memo, useEffect, useState, useCallback } from 'react'
import type { FC } from 'react'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import BalanceDetail from '@/components/pop/BalanceDetail'
import { useDispatch } from 'dva'
import { getBalanceList } from '@/services/balance'
import useTableStoreScroll from '@/hooks/useTableStoreScroll'
import useTableStoreActiveColumn from '@/hooks/useTableStoreActiveColumn'
import Header from './components/Header'
import Filters from './components/Filters'
import Buttons from './components/Buttons'
import './Balance.less'

const tableName = 'balance'

const defaultColumns = [
  { title: '姓名', dataIndex: 'userName', width: 111 },
  { title: '工号', dataIndex: 'jobNumber', width: 114 },
  { title: '所属部门', dataIndex: 'deptName', width: 143 },
  { title: '岗位', dataIndex: 'job', width: 151 }
]
const getColumns = (cells?: any) => {
  if (cells && cells[0] && cells[0].balanceDetails) {
    return [
      ...defaultColumns,
      ...cells[0].balanceDetails.map(
        (
          { ruleId, ruleName, unit }: {
            ruleId: number, ruleName: string, unit: string
          }
        ) => ({
          title: `${ruleName}(${unit})`,
          dataIndex: ruleId,
          width: 102,
          render: (v: number | string) =>
            (typeof v === 'number' && !Number.isNaN(v))
              ? v / 100
              : v || '-'
        })
      )
    ]
  }
  return defaultColumns
}
const getTabs = (cell?: any) => {
  if (cell && cell.balanceDetails) {
    return [
      ...cell.balanceDetails.map(
        (
          { ruleId, ruleName }: {
            ruleId: number, ruleName: string, unit: string
          }
        ) => ({
          tab: ruleName, key: ruleId
        })
      )
    ]
  }
  return []
}

const Balance: FC = () => {
  const updateData = useTableStoreActiveColumn(getColumns)
  const [detailInfo, setDetailInfo] = useState<{
    visible: boolean, item: any, tabs: Tab[]
  }>({ visible: false, item: null, tabs: [] })
  const handleOpenDetail = useCallback(
    (item: any) => {
      const { balanceDetails = [] } = item
      setDetailInfo({
        visible: true,
        item,
        tabs: getTabs({
          balanceDetails: balanceDetails.filter(
            ({ suitable }: { suitable: number | boolean }) => suitable
          )
        })
      })
    },
    []
  )
  const dispatch = useDispatch()
  const handleCloseDetail = useCallback(
    (refreshed: boolean) => {
      if (refreshed) {
        dispatch({ type: 'table/refreshTable' })
      }
      setDetailInfo({ visible: false, item: null, tabs: [] })
    },
    [dispatch]
  )
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          name: 'balance',
          action: getBalanceList,
          columns: getColumns(),
          paramsHandle: (
            p: Record<string, any> = {}, pageNo: number, pageSize: number
          ) => {
            const { deptIds, ...rest } = p
            if (deptIds && deptIds.length > 0) {
              rest.deptIds = deptIds.map(
                ({ id }: { id: string | number }) => id
              ).join(',')
            }
            rest.pageNo = pageNo || 1
            rest.pageSize = pageSize || 10
            return rest
          },
          resultHandle: (r: any, _: number, pageSize: number) => {
            const { page } = r || {}
            const { currentPage = 1, total = 0 } = page
            updateData(r && r.list)
            if (r && r.list) {
              return {
                ...r,
                list: r.list.map((
                  { balanceDetails, ...rest }: {
                    balanceDetails: {
                      suitable: boolean, ruleId: number, balance: number
                    }[]
                  }
                ) => {
                  if (balanceDetails && Array.isArray(balanceDetails)) {
                    const extra = {}
                    balanceDetails.forEach(
                      ({ ruleId, balance, suitable }) => {
                        extra[ruleId] = suitable ? balance : '不适用'
                      }
                    )
                    return {
                      balanceDetails,
                      ...rest,
                      ...extra
                    }
                  }
                  return rest
                }),
                pageNo: currentPage,
                total,
                pageSize
              }
            }
            return {
              ...(r || {}),
              pageNo: currentPage,
              total,
              pageSize
            }
          }
        }
      })
    },
    [dispatch, updateData]
  )
  useEffect(
    () => {
      return () => {
        dispatch({ type: 'table/close' })
      }
    },
    []
  )
  const scroll = useTableStoreScroll()
  return <PageContent className='pg-balance' hasPadding>
    <Header />
    <div className='pg-balance--options'>
      <Filters tableName={tableName} />
      <Buttons />
    </div>
    <StoreTable
      name={tableName}
      rowKey='userId'
      withFooterPagination
      scroll={scroll}
      onRow={(item: any) => ({ onClick: () => handleOpenDetail(item) })}
    />
    <BalanceDetail
      onClose={handleCloseDetail}
      info={detailInfo}
    />
  </PageContent>
}

export default memo(Balance)
