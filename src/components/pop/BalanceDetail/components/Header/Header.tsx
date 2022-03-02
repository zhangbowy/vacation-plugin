import { memo } from 'react'
import type { FC } from 'react'
import './Header.less'
import CommonTabs from '@/components/structure/CommonTabs'

interface HeaderProps {
  tabs: any[]
  activeKey: string
  onActiveChange: (x: string) => void
  detail: any
}

const Header: FC<HeaderProps> = ({ tabs, activeKey, onActiveChange, detail }) => {
  return <div className='com-pop-balance-detail--header'>
    <p className='com-pop-balance-detail--header--title font-bold'>
      余额使用记录
    </p>
    <div className='com-pop-balance-detail--header--user-info'>
      <img
        className='com-pop-balance-detail--header--avatar'
        src='https://www.baidu.com/img/flexible/logo/pc/result@2.png'
      />
      <div className='com-pop-balance-detail--header--user-text'>
        <p className='com-pop-balance-detail--header--name font-bold'>
          { detail.userName }
        </p>
        <p className='com-pop-balance-detail--header--no'>
        { detail.jobNumber }
        </p>
      </div>
    </div>
    <div className='com-pop-balance-detail--header--header-divider' />
    <CommonTabs
      className='com-pop-balance-detail--header--tabs'
      tabs={tabs}
      activeKey={activeKey}
      onChange={onActiveChange}
    />
  </div>
}

export default memo(Header)
