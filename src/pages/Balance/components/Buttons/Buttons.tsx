import { memo } from 'react'
import type { FC } from 'react'
import { useSelector } from 'dva'
import Button from '@/components/buttons/Button'
import { downloadFile } from '@/utils/utils'
import { defaultParamsHandle } from '@/models/table'
import './Buttons.less'

const getUrl = (params = {}) => {
  console.log('need to set')
  let r = 'http://vacation-pc.forwe.work/vacation/balance/ExportList?'
  // let r = `${downloadUrl}${statisticsOfferDetail}?`
  Object.keys(params).forEach(v => {
    if (params[v] === undefined || params[v] === null) {
      return
    }
    // eslint-disable-next-line
    r += `${v}=${params[v]}&`
  })
  // return `${r}token=${storage.getItem('TOKEN')}&`
  return r
}

const Buttons: FC = () => {
  console.log(process.env.NODE_ENV)
  const { params, paramsHandle } = useSelector(state => ({
    params: state.table.params,
    paramsHandle: state.table.paramsHandle
  }))
  const handleExport = () => {
    const p = (paramsHandle || defaultParamsHandle)(params)
    delete p.pageNo
    delete p.pageSize
    downloadFile(getUrl(p), 'aaa.xlsx')
  }
  return <div className='pg-balance--buttons'>
    <Button>使用Excel批量修改</Button>
    <Button type='primary' ghost onClick={handleExport}>导出</Button>
  </div>
}

export default memo(Buttons)
