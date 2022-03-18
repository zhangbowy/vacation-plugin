import { get, post } from '@/utils/request'

export const userLogin = params => post('/user/login', params)

export const userLoginH5 = params => get('/user/getAdminInfo', params)

// 获取钉钉授权的信息
export const getApiTicket = (params) => get('/ding/getJsapiAuth', params)

// 获取用户权限列表
export const getRoleMap = (params) => get('/getRoleMap/x', params)

// 获取钉盘空间 id
export const getGrantUpload4Approval = (params) => get('/getGrantUpload4Approval/x', params)
