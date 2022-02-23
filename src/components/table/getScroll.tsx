export default (
  columns: { width: number, children: { width: number }[] }[],
  init?: number
) => {
  let x = init || 0
  columns.forEach(
    ({ width, children }) => {
      if (width) {
        // eslint-disable-next-line
        x += width
      }
      if (children) {
        children.forEach(({ width: childWidth }: { width: number }) => {
          // eslint-disable-next-line
          x += childWidth
        })
      }
    }
  )
  return x
}
