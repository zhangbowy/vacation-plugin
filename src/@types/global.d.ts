declare interface Resource {
  resourceId: string | number,
  resourceName: string,
  children: Resource[]
}
declare interface Tab {
  tab: string, key: string
}
