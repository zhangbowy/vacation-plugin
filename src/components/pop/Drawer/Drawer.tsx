import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Drawer as AntdDrawer } from 'antd'
import type { DrawerProps as AntdDrawerProps } from 'antd'

interface DrawerProps extends AntdDrawerProps {
  children: any
}

const Drawer: FC<DrawerProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-pop-drawer', className),
    [className]
  )
  return <AntdDrawer className={cName} {...rest} />
}

export default memo(Drawer)
