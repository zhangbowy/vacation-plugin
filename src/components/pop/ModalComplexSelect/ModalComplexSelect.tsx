import { memo } from 'react'
import type { FC } from 'react'
import Content from './components/Content'
import ContextProvider from './context'

interface ModalComplexSelectProps {
  title?: string
  topName?: string
  type?: 'complex' | 'user' | 'dept'
  value?: AddressList
  onChange?: (x: AddressList) => void
  visible?: boolean
  onCancel?: VoidFunction
  onConfirm?: VoidFunction
  selectMode?: 'multiple' | 'single'
}

const ModalComplexSelect: FC<ModalComplexSelectProps> = props => {
  return <ContextProvider>
    <Content {...props} />
  </ContextProvider>
}

export default memo(ModalComplexSelect)
