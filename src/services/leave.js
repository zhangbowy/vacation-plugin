import { post } from '@/utils/request'

export const getLeaveSurvey = params => post('/leave/survey', params)

export const getLeaveRecord = params => post('/leave/record', params)

export const exportLeaveRecord = params => post(
  '/balance/ExportList', params, { download: true }
)
