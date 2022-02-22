import { memo, useEffect, useState } from 'react'
import type { FC } from 'react'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import BalanceDetail from '@/components/pop/BalanceDetail'
import { useDispatch } from 'dva'
import { getBalanceList } from '@/services/balance'
import Header from './components/Header'
import Filters from './components/Filters'
import Buttons from './components/Buttons'
import './Balance.less'


const defaultColumns = [
  { title: '姓名', dataIndex: 'userName' },
  { title: '工号', dataIndex: 'jobNumber' },
  { title: '所属部门', dataIndex: 'deptName' },
  { title: '岗位', dataIndex: 'job' }
]
const getColumns = (cell?: any) => {
  if (cell && cell[0] && cell[0].balanceDetails) {
    return [
      ...defaultColumns,
      ...cell[0].balanceDetails.map(
        (
          { ruleId, ruleName, unit }: {
            ruleId: number, ruleName: string, unit: string
          }
        ) => ({
          title: `${ruleName}(${unit})`, dataIndex: ruleId
        })
      )
    ]
  }
  return defaultColumns
}

const Balance: FC = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const handleCloseDetail = () => { setVisible(false) }
  const dispatch = useDispatch()
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
          resultHandle: (r: any) => {
            if (r && r.list) {
              getColumns(r.list)
              return {
                ...r,
                ...r.list.map((
                  { balanceDetails, ...rest }: {
                    balanceDetails: { ruleId: number, balance: number }[]
                  }
                ) => {
                  if (balanceDetails && Array.isArray(balanceDetails)) {
                    const extra = {}
                    balanceDetails.forEach(
                      ({ ruleId, balance }) => extra[ruleId] = balance
                    )
                    return {
                      ...rest,
                      ...extra
                    }
                  }
                  return rest
                })
              }
            }

            return r
          }
        }
      })
    },
    [dispatch]
  )
  return <PageContent className='pg-balance' hasPadding>
    <Header />
    <div className='pg-balance--options'>
      <Filters />
      <Buttons />
    </div>
    <StoreTable
      name='balance'
      rowKey='userId'
      withFooterPaination
    />
    <BalanceDetail visible={visible} onClose={handleCloseDetail} />
  </PageContent>
}

export default memo(Balance)
