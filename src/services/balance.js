import { get, post } from '@/utils/request'

export const getBalanceList = params => get('/balance/list', params)
