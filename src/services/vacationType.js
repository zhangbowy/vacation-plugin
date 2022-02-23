import { get } from '@/utils/request'

export const getDropdownList = params =>
  get('/vacationType/getDropDownBoxList', params)

export default null