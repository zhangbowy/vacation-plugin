import { memo } from 'react'
import type { FC } from 'react';
import ContentTitle from '@/components/structure/ContentTitle'
import ContentHeader from '@/components/structure/ContentHeader'

const Header: FC = () =>
  <ContentHeader hasPadding hasShadow>
    <ContentTitle>假期规则</ContentTitle>
  </ContentHeader>

export default memo(Header)