import { memo, useState, useMemo } from 'react'
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
  visible: boolean
  onClose: () => void
}

const tabs = [
  { tab: '休假概况', key: 'survey' },
  { tab: '请假记录', key: 'record' }
]

const BalanceDetail: FC<BalanceDetailProps> = ({ visible, onClose }) => {
  const [activeKey, setActiveKey] = useState<string>('survey')
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
    />,
    [activeKey]
  )
  return <Drawer
    className='com-pop-balance-detail'
    visible={visible}
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
