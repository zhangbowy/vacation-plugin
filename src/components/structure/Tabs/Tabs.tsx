import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Tabs as AntdTabs } from 'antd'
import type { TabsProps } from 'antd'

const Tabs: FC<TabsProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-structure-tabs', className),
    [className]
  )
  return <AntdTabs className={cName} {...rest} />
}

export default memo(Tabs)
