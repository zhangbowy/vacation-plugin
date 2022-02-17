import { memo } from 'react'
import type { FC } from 'react'
import './Header.less'
import ContentTitle from '@/components/structure/ContentTitle'
import ContentHeader from '@/components/structure/ContentHeader'
import CommonTabs from '@/components/structure/CommonTabs'

interface HeaderProps {
  tabs: { tab: string, key: string }[]
  activeKey: string
  onTabChange: (tab: string) => void
}

const Header: FC<HeaderProps> = ({ tabs, activeKey, onTabChange }) =>
  <ContentHeader className='pg-overview--header' hasShadow>
    <ContentTitle className='pg-overview--header--title'>休假总览</ContentTitle>
    <div className='pg-overview--header--divider' />
    <CommonTabs className='pg-overview--header--tabs' tabs={tabs} />
  </ContentHeader>

export default memo(Header)
