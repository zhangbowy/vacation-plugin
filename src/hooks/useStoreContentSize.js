import { useState, useEffect } from 'react'
import { useDispatch } from 'dva'

const getContentSize = () => {
  const tar = document.querySelector('.lay-content')
  if (tar) {
    return { width: tar.scrollWidth, height: tar.scrollHeight }
  }
  return undefined
}

const useStoreContentSize = () => {
  const dispatch = useDispatch()
  const [contentSize, setContentSize] = useState(undefined)
  const updateSize = () => {
    setContentSize(getContentSize())
  } 
  useEffect(
    () => {
      updateSize()
      window.addEventListener('resize', updateSize)
      return () => {
        window.removeEventListener('resize', updateSize)
      }
    },
    []
  )
  useEffect(
    () => {
      dispatch({
        type: 'global/updateContentSize',
        contentSize
      })
    },
    [contentSize, dispatch]
  )
}

export default useStoreContentSize
