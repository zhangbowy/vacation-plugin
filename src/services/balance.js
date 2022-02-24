import { get, post } from '@/utils/request'

export const getBalanceList = params => get('/balance/list', params)

export const exportBalanceList = params => get(
  '/balance/ExportList', params, { download: true }
)

export const downloadEditTemplate = params => get(
  '/balance/getEditTemplate', params, { download: true }
)

export const getSyncName = params => get('/balance/synName', params)

export const balanceSync = params => post('/balance/syn', params)

export default null
