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

export const getBalanceRecords = params => post('/balance/changeRecord', params)

export const updateBalance = params =>
  post('/balance/editSingleBalance', params)

export const batchUpload = params =>
  post('/balance/batchEditUpload', params, { upload: true })

export default null
