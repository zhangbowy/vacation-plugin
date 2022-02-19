import { get } from '@/utils/request'

export const getStatisticsList = params => get('statistics/list', params)
