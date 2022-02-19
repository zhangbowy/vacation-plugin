import { memo, useMemo } from 'react'
import type { FC } from 'react'
import classnames from 'classnames'
import { Upload as AntdUpload } from 'antd'
import type { UploadProps as AntdUploadProps } from 'antd'

interface UploadProps extends AntdUploadProps {
  children?: any
}

const Upload: FC<UploadProps> = ({ className, ...rest }) => {
  const cName = useMemo(
    () => classnames('com-form-upload', className),
    [className]
  )
  return <AntdUpload className={cName} {...rest} />
}

export default memo(Upload)
