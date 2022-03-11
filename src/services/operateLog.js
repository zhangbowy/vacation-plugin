import { get } from '@/utils/request'

export const getLogList = params => get('/operateLog/list', params)

export const getLogModules = params => get('/operateLog/getModules', params)
