import { memo, useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import PageContent from '@/components/structure/PageContent'
import StoreTable from '@/components/table/StoreTable'
import { useDispatch } from 'dva'
import Button from '@/components/buttons/Button'
import Icon from '@/components/Icon'
import './Auth.less'
import AuthEdit from './components/AuthEdit'
import Header from './components/Header'
import { getResourceList } from '@/services/role'
import { getResources, getInitTablePayload } from './handleAuth'
import { confirm } from '@/components/pop/Modal'
import { msg } from '@/components/pop'
import { removeRole } from '@/services/role'
import loading from '@/components/pop/loading'
import checkAuth from '@/utils/checkAuth'

const Auth: FC = () => {
  const [resourceList, setResourceList] = useState<any[] | null>(null)
  const dispatch = useDispatch()
  const [info, setInfo] = useState<{ visible: boolean, id: string }>({
    visible: false, id: ''
  })
  const handleEdit = (d: any) => {
    setInfo({ visible: true, id: d.id })
  }
  const handleRemove = useCallback(
    (d: any) => {
      confirm({
        title: '提示',
        content: '确定要删除权限吗？',
        onOk: () => {
          loading.show()
          removeRole({ id: d.id }).then(
            ([success]) => {
              loading.hide()
              if (success) {
                msg('删除成功')
                dispatch({ type: 'table/refreshTable' })
              }
            }
          )
        }
      })
    },
    [dispatch]
  )
  useEffect(
    () => {
      getResourceList().then(
        ([success, result]) => {
          const resources = success ? getResources(result || []) : []
          setResourceList(resources)
          dispatch({
            type: 'table/initTable',
            payload: getInitTablePayload(
              resources, handleEdit, handleRemove
            )
          })
        }
      )
    },
    [dispatch, handleRemove]
  )
  return (
    <PageContent className='pg-auth' hasPadding>
      <Header />
      {
        checkAuth(6002) &&
        <div className='pg-auth--filters'>
          <Button
            type="primary"
            key="primary"
            onClick={() => setInfo({ visible: true, id: '' })}
          >
            <Icon type='icon-tianjia' />
            <span>新增权限</span>
          </Button>
        </div>
      }
      <StoreTable name='auth' rowKey='id' />
      <AuthEdit
        {...info}
        resourceList={resourceList}
        onVisibleChange={(newInfo) => setInfo(newInfo)}
      />
    </PageContent>
  )
}

export default memo(Auth)
