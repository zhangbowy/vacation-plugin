import { memo } from 'react'
import type { FC } from 'react'
import './Header.less'
import ContentTitle from '@/components/structure/ContentTitle'
import ContentHeader from '@/components/structure/ContentHeader'

const Header: FC = () =>
  <ContentHeader hasPadding hasShadow>
    <ContentTitle hasReturn>
      使用Excel批量修改
    </ContentTitle>
  </ContentHeader>

export default memo(Header)
