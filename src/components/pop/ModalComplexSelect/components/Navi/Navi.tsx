import { memo, useContext, Fragment } from 'react'
import type { FC } from 'react'
import './Navi.less'
import { context } from '../../reducer'
import Icon from '@/components/Icon'

const paths = [
  {
    id: '1', name: '开发中心'
  }, {
    id: '2', name: '测试部'
  // }, {
  //   id: '3', name: '开发中心'
  // }, {
  //   id: '4', name: '测试部'
  // }, {
  //   id: '5', name: '开发中心'
  // }, {
  //   id: '6', name: '测试部'
  }
]

const Navi: FC = () => {
  const { state: { topName } } = useContext(context)
  return <div className='com-pop-modal-complex-select--navi'>
    {
      topName &&
      <p className='com-pop-modal-complex-select--navi--name'>
        { topName }
      </p>
    }
    {
      paths.map(
        ({ id, name }, i) => {
          if (i && !topName) {
            return <p
              key={id}
              className='com-pop-modal-complex-select--navi--name'
            >
              { name }
            </p>
          }
          return <Fragment key={id}>
            <Icon
              className='com-pop-modal-complex-select--navi--divider'
              type='icon-youjiantou'
            />
            <p className='com-pop-modal-complex-select--navi--name'>
              { name }
            </p>
          </Fragment>
        }
      )
    }
  </div>
}

export default memo(Navi)
