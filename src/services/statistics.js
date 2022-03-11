import { post } from '@/utils/request'

export const getStatisticsList = params => post('/statistics/list', params)

export const exportStatisticsList = params => post(
  '/statistics/listExport', params, { download: true }
)
