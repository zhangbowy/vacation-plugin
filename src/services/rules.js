import { get, post } from '@/utils/request';

export const getRulesList = (params) => get('/vacationType/list', params);
export const addRule = (params) => post('/vacationType/add', params);
export const editRule = (params) => post('/vacationType/update', params);
export const delRule = (params) => get('/vacationType/delete', params);
