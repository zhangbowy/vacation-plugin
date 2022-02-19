import { get, post } from '@/utils/request'

export const getRoleList = params => get('/role/list', params)

export const updateRole = params =>
  post(params && params.id ? '/role/edit' : '/role/add', params)

