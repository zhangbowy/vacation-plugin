import { get, post } from '@/utils/request'

export const getRoleList = params => get('/role/list', params)

export const updateRole = params =>
  post(params && params.id ? '/role/edit' : '/role/add', params)

export const getResourceList = params => get('/role/getResourceList', params)

export const removeRole = params => get('/role/del', params)

export const getRoleDetail = params => get('/role/detail', params)

export default null
