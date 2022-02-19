import { get } from '@/utils/request'

export const getLogList = params => get('/operateLog/list', params)
