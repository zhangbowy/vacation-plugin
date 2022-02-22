import { getRoleList } from '@/services/role'
import Tooltip from '@/components/pop/Tooltip'
import getActions from '@/components/table/getAction'

interface ResourceProps {
  resourceId: number
  resourceName: string
  children?: ResourceProps[]
  options?: { label: string, value: number | string }[]
}

const getResource = (
  list: ResourceProps[], map: Record<string, boolean>
): ResourceProps[] => {
  const r: ResourceProps[] = []
  list.forEach(({ resourceId, children, resourceName }) => {
    if (children) {
      const newChildren = getResource(children, map)
      if (newChildren && newChildren.length > 0) {
        r.push({
          resourceId, resourceName, children: newChildren
        })
        return
      }
    }
    if (map[resourceId]) {
      r.push({
        resourceId, resourceName
      })
    }
  })
  return r
}

const getItemResources = (
  resourceVOS: { resourceId: number, resourceName?: string }[],
  resources: ResourceProps[]
) => {
  if (!resourceVOS || !resources) {
    return []
  }
  const map = {}
  resourceVOS.forEach(({ resourceId }) => map[resourceId] = true)

  return getResource(resources, map)
}

export const getResources = (resources: ResourceProps[]): ResourceProps[] => {
  return resources.map(({ resourceId, resourceName, children }: ResourceProps) => {
    const r: ResourceProps = {
      resourceId,
      resourceName,
    }
    if (children) {
      r.children = getResources(children)
      r.options = children.map(({
        resourceId: childResourceId, resourceName: childResourceName
      }) => ({
        value: childResourceId,
        label: childResourceName
      }))
    }
    return r
  })
}

interface Resource {
  resourceId: string | number,
  resourceName: string,
  children: Resource[]
}

const getTexts = (
  isAll: boolean,
  itemResources: Resource[],
  allResources: Resource[]
) => {
  const r: string[] = []
  if (isAll) {
    allResources.forEach(({ resourceName, children }: Resource) => {
      if (children && children.length > 0) {
        r.push(`${
          resourceName
        }：${
          children.map(
            ({ resourceName: childResourceName }) => childResourceName
          ).join('，')
        }`)
      } else {
        r.push(resourceName)
      }
    })
  } else {
    const map: Record<string, boolean> = {}
    itemResources.forEach(({ resourceId }: Resource) =>
      map[resourceId] = true
    )
    allResources.forEach(({ resourceName, resourceId, children }: Resource) => {
      const c = (children || []).filter(
        ({ resourceId: childResourceId }) =>
          map[childResourceId]
      )
      if (c.length > 0) {
        r.push(
          `${
            resourceName
          }：${
            c.map(
              ({ resourceName: childResourceName }) => childResourceName
            ).join('，')
          }`
        )
      } else if (map[resourceId]) {
        r.push(resourceName)
      }
    })
  }
  return r.map((t, i) => {
    const key = i
    return <p key={key}>{ t }</p>
  })
}

export const getInitTablePayload = (
  resources: any[],
  handleEdit: (d: any) => void,
  handleRemove: (d: any) => void
) => ({
  name: 'auth',
  action: getRoleList,
  columns: [
    { title: '权限名称', dataIndex: 'name', width: '17.918%' },
    {
      title: '成员',
      dataIndex: 'userBOS',
      width: '26.513%',
      render: (d: any[]) => {
        if (d && d.length > 0) {
          const titles = d.map(
            ({ name }: { name: string }) => name
          )
          const longText = titles.join('，')
          return <Tooltip overlayClassName='pg-auth--tooltip' title={longText}>
            {
              d.length > 3
                ? `${titles.slice(0, 3).join('，')}等${d.length}个人`
                : longText
            }
          </Tooltip>
        }
        return '-'
      }
    },
    {
      title: '管理范围',
      className: 'ellipsis',
      key: 'dataAuthority',
      render: (
        { dataAuthority, deptBOs }: {
          dataAuthority: number, deptBOs: any[]
        }
      ) => {
        if (dataAuthority === 0) {
          return '全公司'
        }
        if (dataAuthority === 1) {
          return '所在部门及其下属部门'
        }
        const text = deptBOs.map(({ name }) => name).join('，')
        return <Tooltip overlayClassName='pg-auth--tooltip' title={text}>
          <p className='ellipsis'>
            {
              `指定部门：${
                deptBOs.map(({ name }) => name).join('，')
              }`
            }
          </p>
        </Tooltip>
      }
    },
    {
      title: '权限',
      key: 'resourceVOS',
      width: '13.559%',
      render: (
        { isAllHandleAuthority, resourceVOS }:
        { isAllHandleAuthority: boolean, resourceVOS: any[] }
      ) => {
        const popTitle = getTexts(isAllHandleAuthority, resourceVOS, resources)
        return <Tooltip overlayClassName='pg-auth--tooltip' title={popTitle}>
          {
            isAllHandleAuthority
              ? '全部权限'
              : `共${resourceVOS ? resourceVOS.length : 0}个权限`
          }
        </Tooltip>
      }
    },
    getActions({
      width: 106,
      getHandles: (v: any) => [
        {
          title: '编辑',
          handle: handleEdit
        }, {
          title: '删除',
          handle: handleRemove,
          disabled: v.isDefault
        }
      ]
    })
  ],
  resultHandle: (fetchResult: any) => {
    const r = fetchResult || []
    const total = r.length
    return {
      list: r.map(
        (v: any) => ({
          ...v,
          resources: getItemResources(v.resourceVOS, resources)
        })
      ),
      pageNo: 1,
      pageSize: total,
      total: total
    }
  }
})

export default null
