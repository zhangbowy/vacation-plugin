import { memo } from 'react'
import type { FC } from 'react'
import './ModalComplexSelect.less'
import Content from './components/Content'
import ContextProvider from './reducer'

interface ModalComplexSelectProps {
  title?: string
  type?: 'complex' | 'user' | 'dept'
  options?: any[]
  value?: any[]
  topName?: string,
  onChange?: VoidFunction
  visible?: boolean
  onCancel?: VoidFunction
  onConfirm?: VoidFunction
}

const ModalComplexSelect: FC<ModalComplexSelectProps> = props => {
  return <ContextProvider>
    <Content {...props} />
  </ContextProvider>
}

export default memo(ModalComplexSelect)
