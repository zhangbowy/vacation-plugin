import { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'
import './ContentHeader.less'

interface ContentHeaderProps {
  className?: string
  hasPadding?: boolean
  hasShadow?: boolean
}

class ContentHeader extends PureComponent<ContentHeaderProps> {
  el = document.createElement('div')

  componentDidMount() {
    const { className, hasPadding, hasShadow } = this.props
    const elHeader = document.getElementById('lay-basic-layout--content-header')
    this.el.setAttribute(
      'class', classnames(
        'com-structure-content-header',
        className,
        {
          'has-padding': hasPadding,
          'has-shadow': hasShadow
        }
      )
    )
    if (elHeader) {
      elHeader.appendChild(this.el)
    }
  }

  componentWillUnmount() {
    const elHeader = document.getElementById('lay-basic-layout--content-header')
    if (elHeader) {
      elHeader.removeChild(this.el)
    }
  }

  render() {
    const { children } = this.props
    return createPortal(children, this.el)
  }
}

export default ContentHeader
