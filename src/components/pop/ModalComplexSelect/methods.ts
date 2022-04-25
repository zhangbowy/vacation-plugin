import { getAddressList, searchAddressList } from '@/services/address'
import loading from '@/components/pop/loading'

let fetchId = 0
// 选人时也要显示部门信息
const mapType = {
  dept: 1, user: 3, complex: 3
}

export const handleList = (
  params: { deptId?: string | number, type: string },
  callback: (x: any) => void
) => {
  const flag = ++fetchId
  loading.show()
  return getAddressList({
    deptId: params.deptId || 1,
    type: mapType[params.type] || 3
  }).then(d => {
    loading.hide()
    if (flag === fetchId && d[0]) {
      const { depts = [], users = [] } = d[1] || {}
      const r = {
        departments: depts.map(
          ({ deptId, name }: { deptId: string, name: string }) =>
            ({ id: deptId, name })
        ),
        users: users.map(
          (
            { dingUserId, userName, userAvatar }:
            { dingUserId: string, userName: string, userAvatar: string }
          ) =>
            ({ id: dingUserId, name: userName, avatar: userAvatar })
        )
      }
      callback(r)
    }
  })
}

export const handleSearch = (
  params: { search: string | number, type: string },
  callback: (x: any) => void
) => {
  const flag = ++fetchId
  loading.show()
  return searchAddressList({
    search: params.search,
    type: mapType[params.type] || 3
  }).then(d => {
    loading.hide()
    if (flag === fetchId && d[0]) {
      const { depts = [], users = [] } = d[1] || {}
      const r = {
        departments: depts.map(
          ({ deptId, name }: { deptId: string, name: string }) =>
            ({ id: deptId, name })
        ),
        users: users.map(
          (
            { dingUserId, userName, userAvatar }:
            { dingUserId: string, userName: string, userAvatar: string }
          ) =>
            ({ id: dingUserId, name: userName, avatar: userAvatar })
        )
      }
      callback(r)
    }
  })
}

export default null
