import config from '@/config';
interface PermissionItem {
  parentId: number;
  resourceId: number;
  resourceName: string;
}
/**
 * 判断按钮权限
 * @param resourceId 权限id  /role/getResourceList 接口返回的resourceId
 * @return boolean true 有权限 false 没权限
 */
export function hasPermission(resourceId: number): boolean {
  return config.resourceList.some((item: PermissionItem) => resourceId === item.resourceId);
}
