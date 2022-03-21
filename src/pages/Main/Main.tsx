import { memo, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import './Main.less'
import { history } from 'umi'
import PageContent from '@/components/structure/PageContent'
import ContentTitle from '@/components/structure/ContentTitle'
import ContentHeader from '@/components/structure/ContentHeader'
import Icon from '@/components/Icon'
import checkAuth from '@/utils/checkAuth';
import { addRoutes } from '@/init/initPatchRoutes'

const Main: FC = () => {
  const gotoPage = useCallback(
    path => {
      history.push(path)
    },
    []
  )
  const list = useMemo(
    () => addRoutes.filter(({ permissionId, hideInMenu }) =>
      checkAuth(permissionId) && !hideInMenu
    ),
    []
  )
  return <PageContent className='pg-main'>
    <ContentHeader hasPadding hasShadow>
      <ContentTitle hasReturn={false}>假期管理</ContentTitle>
    </ContentHeader>
    {
      list.map(
        ({ path, name, icon }) =>
          <div
            key={path}
            className='pg-main--item ellipsis'
            onClick={() => gotoPage(path)}
          >
            {
              icon &&  <div className='pg-main--icon-wrap'>
                <Icon className='pg-main--icon' type={icon} />
              </div>
            }
            <p className='pg-main--name font-bolder ellipsis'>{ name }</p>
          </div>
      )
    }
  </PageContent>
}

export default memo(Main)
