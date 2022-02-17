import { memo, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import classnames from 'classnames'
import './CommonTabs.less'
import Tabs, { TabPane } from '../Tabs'

interface TabProp {
  tab: string | ReactNode
  key: string
}

const CommonTabs: FC<{ tabs: TabProp[], className?: string }> = ({
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
