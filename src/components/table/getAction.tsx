import './getAction.less'

interface contentProps {
  title: string
  handle: (...x: any[]) => any
  disabled?: boolean
}

export default ({
  title = '操作', key = 'option', getHandles, width
}: {
  title?: string,
  key?: string,
  width?: number,
  getHandles: (...x: any[]) => contentProps[]
}) => ({
  title,
  width,
  key,
  render: ((...args: any[]) => {
    const actions = getHandles ? getHandles(...args) || [] : [];
    return actions.map(
      ({ title: actionTitle, handle, disabled }: contentProps, i) => {
        const contentKey = i;
      if (disabled) {
        return <a
          key={contentKey}
          className='com-table-get-action--link is-disabled'
        >
          { actionTitle }
        </a>
      }
      return <a
        key={contentKey}
        className='com-table-get-action--link'
        onClick={() => handle(...args)}
      >
        { actionTitle }
      </a>
      }
    )
  })
})
