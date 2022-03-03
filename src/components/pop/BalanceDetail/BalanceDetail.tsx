import { memo, useState, useMemo, useEffect, useRef, useCallback } from 'react'
import type { FC } from 'react'
import './BalanceDetail.less'
import Drawer from '@/components/pop/Drawer'
import Icon from '@/components/Icon'
import Empty from '@/components/Empty'
import { getBalanceRecords } from '@/services/balance'
import Header from './components/Header'
import Rest from './components/Rest'
import Item from './components/Item'
import ModalBalance from './components/ModalBalance'

interface BalanceDetailProps {
  onClose: (x: boolean) => void
  info: { visible: boolean, item: any, tabs: Tab[] }
}

const BalanceDetail: FC<BalanceDetailProps> = ({ info, onClose }) => {
  const refUserId = useRef<string>('')
  const refUpdated = useRef<boolean>(false)
  const [recordInfo, setRecordInfo] = useState<{
    data: { durationType?: 0 | 2, duration?: number },
    list: any[]
  }>({ data: {}, list: [] })
  const [activeKey, setActiveKey] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const onModalOpen = () => {
    setModalVisible(true)
  }
  const fetchRecords = (ruleId: string) => {
    getBalanceRecords({
      userId: refUserId.current,
      ruleId: ruleId,
      pageNo: 1,
      pageSize: 100000000
    }).then(d => {
      const [success, result] = d
      if (success) {
        const { list = [], data = {} } = result || {}
        setRecordInfo({ data, list })
      }
    })
  }
  const onModalClose = () => {
    setModalVisible(false)
  }
  const onModalConfirm = useCallback(
    () => {
      fetchRecords(activeKey)
      refUpdated.current = true
      setModalVisible(false)
    },
    [activeKey]
  )
  const detailTitle = useMemo(
    () => <Header
      tabs={info.tabs || []}
      activeKey={activeKey}
      onActiveChange={setActiveKey}
      detail={info.item || {}}
    />,
    [activeKey, info]
  )
  useEffect(
    () => {
      if (info.visible && info.item && info.tabs[0]) {
        refUserId.current = info.item.userId
        setActiveKey(info.tabs[0].key)
      } else {
        refUserId.current = ''
        setActiveKey('')
      }
    },
    [info]
  )
  useEffect(
    () => {
      if (activeKey && refUserId.current) {
        fetchRecords(activeKey)
      } else {
        setRecordInfo({ data: {}, list: [] })
      }
    },
    [activeKey]
  )
  const handleClose = useCallback(
    () => {
      if (onClose) {
        onClose(refUpdated.current)
      }
    },
    [onClose]
  )
  const title = useMemo(
    () => {
      if (info && info.tabs && activeKey) {
        const tar = info.tabs.find(v => v.key === activeKey)
        if (tar) {
          return tar.tab
        }
      }
      return '调休假'
    },
    [info, activeKey]
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
    onClose={handleClose}
  >
    {
      activeKey
        ? <>
          <Rest
            onModalOpen={onModalOpen}
            data={recordInfo.data}
            title={title}
          />
          {
            recordInfo.list.length
              ? <Item title={title} list={recordInfo.list} />
              : <Empty text='暂无使用记录' />
          }
        </>
        : <Empty text='暂无适用假期' />
    }
    <ModalBalance
      visible={modalVisible}
      data={recordInfo.data}
      onCancel={onModalClose}
      onConfirm={onModalConfirm}
      ruleId={activeKey}
      item={info.item}
    />
  </Drawer>
}

export default memo(BalanceDetail)
