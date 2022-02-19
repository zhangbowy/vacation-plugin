import { get } from '@/utils/request'

export const getBalanceList = params => get('/balance/list', params)

export const exportBalanceList = params => get(
  '/balance/ExportList', params, { download: true }
)

export const downloadEditTemplate = params => get(
  '/balance/getEditTemplate', params, { download: true }
)
