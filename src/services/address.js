import { post } from '@/utils/request'

export const getAddressList = params => post('/address/getChild', params)

export const searchAddressList = params =>
  post('/address/searchDeptAndStaff', params)
