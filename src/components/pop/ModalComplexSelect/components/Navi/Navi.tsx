import { memo, useContext, Fragment, useCallback } from 'react'
import type { FC } from 'react'
import './Navi.less'
import { context } from '../../context'
import Icon from '@/components/Icon'

const Navi: FC = () => {
  const { state: { topName, paths, searchString }, actions } = useContext(context)
  const handleTop = useCallback(
    () => {
      if (paths.length > 0) {
        actions.changeDept([])
      }
    },
    [paths, actions]
  )
  const handleChange = useCallback(
    index => {
      if (paths.length - 1 > index) {
        actions.changeDept(paths.slice(0, index + 1))
      }
    },
    [paths, actions]
  )
  if (searchString) {
    return null
  }
  return <div className='com-pop-modal-complex-select--navi'>
    {
      topName &&
      <p
        className='com-pop-modal-complex-select--navi--name'
        onClick={handleTop}
      >
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
            <p
              className='com-pop-modal-complex-select--navi--name'
              onClick={() => handleChange(i)}
            >
              { name }
            </p>
          </Fragment>
        }
      )
    }
  </div>
}

export default memo(Navi)
