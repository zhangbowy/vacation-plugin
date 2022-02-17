import { memo, useState, useEffect } from 'react'
import type { FC } from 'react'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch, useSelector } from 'dva'
import { Button } from 'antd'
import './Auth.less'
import AuthEdit from './components/AuthEdit'
import Header from './components/Header'
import Icon from '@/components/Icon'

const Auth: FC = () => {
  const dispatch = useDispatch()
  console.log('useDispatch', dispatch)
  const params = useSelector(state => state.table.params)
  console.log('params', params)
  const handleEdit = (d: any) => {
    console.log('edit', d)
  }
  const handleRemove = (d: any) => {
    console.log('remove', d)
  }
  useEffect(
    () => {
      dispatch({
        type: 'table/initTable',
        payload: {
          columns: [
            { title: '权限名称', dataIndex: 'name' },
            { title: '成员', dataIndex: 'user' },
            { title: '管理范围', dataIndex: 'range' },
            { title: '权限', dataIndex: 'auth' },
            {
              title: '操作',
              key: 'option',
              render: (d: any) => [
                <a key="edit" onClick={() => handleEdit(d)}>编辑</a>,
                <a key="remove" onClick={() => handleRemove(d)}>删除</a>
              ]
            }
          ]
        }
      })
    },
    [dispatch]
  )
  const [info, setInfo] = useState<{ visible: boolean, id: string }>({
    visible: false, id: ''
  })
  return (
    <PageContent className='pg-auth' hasPadding>
      <Header />
      <div className='pg-auth--filters'>
        <Button type="primary" key="primary" onClick={() => setInfo({ visible: true, id: '' })}>
          <Icon type='icon-tianjia' />
          <span>新增权限</span>
        </Button>
      </div>
      <StoreTable withFooterPaination />
      <AuthEdit {...info} onVisibleChange={(newInfo) => setInfo(newInfo)} />
    </PageContent>
  )
}

export default memo(Auth)
