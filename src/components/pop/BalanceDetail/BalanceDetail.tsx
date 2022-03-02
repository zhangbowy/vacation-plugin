import { memo, useState, useMemo, useEffect } from 'react'
import type { FC } from 'react'
import './BalanceDetail.less'
import Drawer from '@/components/pop/Drawer'
import Icon from '@/components/Icon'
import Empty from '@/components/Empty'
import Header from './components/Header'
import Rest from './components/Rest'
import Item from './components/Item'
import ModalBalance from './components/ModalBalance'

interface BalanceDetailProps {
  onClose: () => void
  info: { visible: boolean, item: any }
  tabs: Tab[]
}

const BalanceDetail: FC<BalanceDetailProps> = ({ info, onClose, tabs }) => {
  const [activeKey, setActiveKey] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const onModalOpen = () => {
    setModalVisible(true)
  }
  const onModalClose = () => {
    setModalVisible(false)
  }
  const detailTitle = useMemo(
    () => <Header
      tabs={tabs}
      activeKey={activeKey}
      onActiveChange={setActiveKey}
      detail={info.item || {}}
    />,
    [activeKey, tabs, info]
  )
  useEffect(
    () => {
      if (info.visible) {
        console.log('xxx')
      }
    },
    [info]
  )
  useEffect(
    () => {
      if (tabs && tabs[0]) {
        setActiveKey(tabs[0].key)
      }
    },
    [tabs]
  )
  return <Drawer
    className='com-pop-balance-detail'
    visible={info.visible}
    title={detailTitle}
    width={600}
    closeIcon={
      <Icon
        className='com-pop-balance-detail--close-icon'
        type='icon-guanbi'
      />
    }
    onClose={onClose}
  >
    <Rest onModalOpen={onModalOpen} />
    { false && <Empty text='暂无使用记录' /> }
    <Item />
    <ModalBalance visible={modalVisible} onCancel={onModalClose} />
  </Drawer>
}

export default memo(BalanceDetail)
