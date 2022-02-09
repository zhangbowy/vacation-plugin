import { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'

interface ContentFooterProps {
  className?: string
  hasPadding?: boolean
  hasShadow?: boolean
}

class ContentFooter extends PureComponent<ContentFooterProps> {
  el = document.createElement('div')

  componentDidMount() {
    const { className, hasPadding, hasShadow } = this.props
    const elFooter = document.getElementById('lay-basic-layout--content-footer')
    this.el.setAttribute(
      'class', classnames(
        'com-structure-content-footer',
        className,
        {
          'has-padding': hasPadding,
          'has-shadow': hasShadow
        }
      ))
    if (elFooter) {
      elFooter.appendChild(this.el)
    }
  }

  componentWillUnmount() {
    const elFooter = document.getElementById('lay-basic-layout--content-footer')
    if (elFooter) {
      elFooter.removeChild(this.el)
    }
  }

  render() {
    const { children } = this.props
    return createPortal(children, this.el)
  }
}

export default ContentFooter
