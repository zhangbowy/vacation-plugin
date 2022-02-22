import { memo, Fragment, useMemo, useCallback } from 'react'
import type { FC } from 'react'
import Checkbox from '@/components/form/Checkbox'
import './CheckGroups.less'

interface CheckGroupsProps {
  value?: any
  onChange?: (x: any) => void
  resourceList: any[] | null
}

const CheckGroups: FC<CheckGroupsProps> = ({ resourceList, value, onChange }) => {
  const { resourceMap, isAllHandleAuthority } = useMemo(
    () => ({
      isAllHandleAuthority: value && value.isAllHandleAuthority || false,
      resourceMap: value && value.resourceMap || {}
    }),
    [value]
  )
  const handleChange = useCallback(
    (id, headerResourceId, headerChildren) => {
      if (!onChange) {
        return
      }
      const { resourceMap: preResourceMap } = value || {}
      if (preResourceMap && preResourceMap[id]) {
        onChange({
          isAllHandleAuthority: false,
          resourceMap: {
            ...(preResourceMap || {}),
            [id]: false,
            [headerResourceId]: false
          }
        })
      } else {
        const newResourceMap = {
          ...(preResourceMap || {}),
          [id]: true
        }
        newResourceMap[headerResourceId] = (headerChildren || []).every(
          ({ resourceId }: { resourceId: string | number }) =>
            newResourceMap[resourceId]
        )
        onChange({
          isAllHandleAuthority: resourceList?.every(
            ({ resourceId }) => newResourceMap[resourceId]
          ),
          resourceMap: newResourceMap
        })
      }
    },
    [value, onChange, resourceList]
  )
  const indeterminateAll = useMemo(
    () => {
      if (isAllHandleAuthority) {
        return false
      }
      return resourceList?.some(
        ({ resourceId, children = [] }) => {
          return resourceMap[resourceId] || children.some(
            (
              { resourceId: childResourceId }: { resourceId: string | number }
            ) => resourceMap[childResourceId]
          )
        }
      )
    },
    [isAllHandleAuthority, resourceMap, resourceList]
  )
  const handleChangeAll = useCallback(
    ({ target: { checked } }) => {
      if (onChange) {
        if (checked) {
          const map: Record<string, boolean> = {}
          const list = resourceList || []
          list.forEach(
            ((
              { resourceId, children }:
              { resourceId: string | number, children?: [] }
            ) => {
              map[resourceId] = true
              if (children) {
                children.forEach((
                  { resourceId: childResourceId }:
                  { resourceId: string | number }
                ) => {
                  map[childResourceId] = true
                })
              }
            })
          )
          onChange({
            isAllHandleAuthority: true,
            resourceMap: map
          })
        } else {
          onChange({
            isAllHandleAuthority: false,
            resourceMap: false
          })
        }
      }
    },
    [onChange, resourceList]
  )
  const handleClickHeader = useCallback(
    (headerResourceId, headerChildren) => {
      if (!onChange) {
        return
      }
      const { resourceMap: preResourceMap } = value || {}
      if (preResourceMap && preResourceMap[headerResourceId]) {
        const newResourceMap = {
          ...(preResourceMap || {}),
          [headerResourceId]: false
        }
        if (headerChildren) {
          headerChildren.forEach(
            ({ resourceId }: { resourceId: string | number }) => {
              newResourceMap[resourceId] = false
            }
          )
        }
        onChange({
          isAllHandleAuthority: false,
          resourceMap: newResourceMap
        })
      } else {
        const newResourceMap = {
          ...(preResourceMap || {}),
          [headerResourceId]: true
        }
        if (headerChildren) {
          headerChildren.forEach(
            ({ resourceId }: { resourceId: string | number }) => {
              newResourceMap[resourceId] = true
            }
          )
        }
        onChange({
          isAllHandleAuthority: resourceList?.every(
            ({ resourceId }) => newResourceMap[resourceId]
          ),
          resourceMap: newResourceMap
        })
      }
    },
    [value, onChange, resourceList]
  )
  if (!resourceList || !resourceList.length) {
    return null
  }
  return <div className='com-auth--check-groups'>
    <Checkbox
      className='com-auth--check-groups--all'
      indeterminate={indeterminateAll}
      checked={isAllHandleAuthority}
      onChange={handleChangeAll}
    >
      全选
    </Checkbox>
    <div className='com-auth--check-groups--content'>
      {
        resourceList.map(
          ({ resourceId, resourceName, children }) => {
            const indeterminate = !resourceMap[resourceId] && children.some(
              (
                { resourceId: childResourceId }:
                { resourceId: string | number }
              ) =>
                resourceMap[childResourceId]
            )
            return <Fragment key={resourceId}>
              <Checkbox
                className='com-auth--check-groups--header'
                indeterminate={indeterminate}
                checked={resourceMap[resourceId]}
                onChange={() => handleClickHeader(resourceId, children)}
              >
                <span className='com-auth--check-groups--header-text'>
                  { resourceName }
                </span>
              </Checkbox>
              {
                children && children.length > 0 &&
                <div className='com-auth--check-groups--list'>
                  {
                    children.map(({
                      resourceId: childResourceId, resourceName: childResourceName
                    }: {
                      resourceId: string | number, resourceName: string
                    }) =>
                      <Checkbox
                        key={childResourceId}
                        checked={resourceMap[childResourceId]}
                        onChange={() => {
                          handleChange(
                            childResourceId, resourceId, children
                          )
                        }}
                      >
                        { childResourceName }
                      </Checkbox>
                    )
                  }
                </div>
              }
            </Fragment>
          }
        )
      }
    </div>
  </div>
}

export default memo(CheckGroups)
