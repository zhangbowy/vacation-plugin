import { memo, useEffect } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch, useSelector } from 'dva'
// import { useSelector } from 'dva'
import Header from './components/Header'
import Filters from './components/Filters'
import Buttons from './components/Buttons'
import './Balance.less';

const Balance: FC = () => {
  const dispatch = useDispatch()
  console.log('useDispatch', dispatch)
  const params = useSelector(state => state.table.params)
  console.log('params', params)
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          columns: [
            { title: '姓名', dataIndex: 'name' },
            { title: '工号', dataIndex: 'no' },
            { title: '所属部门', dataIndex: 'dept' },
            { title: '岗位', dataIndex: 'job' },
            { title: '事假(小时)', dataIndex: 'thing' },
            { title: '年假(天)', dataIndex: 'year' },
            { title: '调休(天)', dataIndex: 'get' }
          ]
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
    <StoreTable withFooterPaination />
  </PageContent>;
};

export default memo(Balance);
