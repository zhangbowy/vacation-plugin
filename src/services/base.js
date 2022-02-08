import { get } from '@/utils/request';

// 获取钉钉授权的信息
export const getApiTicket = (params) => get('/xxx/x', params);

// 获取用户权限列表
export const getRoleMap = (params) => get('/xxx/x', params);

// 获取钉盘空间 id
export const getGrantUpload4Approval = (params) => get('/xxx/x', params);
