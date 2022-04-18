import { memo, useState, useEffect, useRef } from 'react'
import type { FC } from 'react';
import ContentTitle from '@/components/structure/ContentTitle'
import ContentHeader from '@/components/structure/ContentHeader'
import Button from '@/components/buttons/Button'
import { getSyncName } from '@/services/balance'
import ModalSync from '../ModalSync'
import './Header.less'

const Header: FC = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const refDestroyed = useRef(false)
  const [syncOptions, setSyncOptions] = useState<string[]>([])
  useEffect(
    () => {
      refDestroyed.current = false
      return () => {
        refDestroyed.current = true
      }
    },
    []
  )
  const handleOpen = () => {
    setVisible(true)
    setSyncOptions([])
    getSyncName().then(d => {
      if (d[0] && !refDestroyed.current) {
        setSyncOptions(d[1])
      }
    })
  }
  const handleHide = () => {
    setVisible(false)
  }
  return <ContentHeader className='pg-balance--header' hasPadding hasShadow>
    <ContentTitle>假期余额</ContentTitle>
    <Button onClick={handleOpen}>同步历史余额</Button>
    <ModalSync
      visible={visible}
      onCancel={handleHide}
      syncOptions={syncOptions}
    />
  </ContentHeader>
}

export default memo(Header)
