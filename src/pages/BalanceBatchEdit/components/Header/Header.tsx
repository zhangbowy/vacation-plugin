import { memo } from 'react'
import type { FC } from 'react'
import { history } from 'umi'
import './Header.less'
import ContentTitle from '@/components/structure/ContentTitle'
import ContentHeader from '@/components/structure/ContentHeader'
import Icon from '@/components/Icon'

const Header: FC = () => {
  const handleReturn = () => {
    history.goBack()
  }
  return <ContentHeader hasPadding hasShadow>
    <ContentTitle
      className='pg-balance-batch-edit--header--title'
      onClick={handleReturn}
    >
      <Icon
        className='pg-balance-batch-edit--header--icon'
        type='icon-fanhui'
      />
      <span>使用Excel批量修改</span>
    </ContentTitle>
  </ContentHeader>
}

export default memo(Header)
