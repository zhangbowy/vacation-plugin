import { memo, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import classnames from 'classnames'
import './CommonTabs.less'
import type { TabsProps } from 'antd'
import Tabs, { TabPane } from '../Tabs'

interface TabProp extends TabsProps {
  tab: string | ReactNode
  key: string
}
interface CommonTabsProps extends TabsProps {
  className?: string
  activeKey: string
  tabs: TabProp[]
}

const CommonTabs: FC<CommonTabsProps> = ({
  className, tabs = [], ...rest
}) => {
  const cName = useMemo(
    () => classnames('com-structure-common-tabs', className),
    [className]
  )
  return <Tabs className={cName} {...rest}>
    {
      tabs.map(({ tab, key }: TabProp) => 
        <TabPane key={key} tab={tab} />
      )
    }
  </Tabs>
}

export default memo(CommonTabs)
