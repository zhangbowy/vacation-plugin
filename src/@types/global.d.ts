declare interface Resource {
  resourceId: string | number,
  resourceName: string,
  children: Resource[]
}
