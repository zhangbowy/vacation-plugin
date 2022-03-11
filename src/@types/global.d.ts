declare interface Resource {
  resourceId: string | number,
  resourceName: string,
  children: Resource[]
}
declare interface Tab {
  tab: string, key: string
}
declare interface OptionProps {
  label: string | number, value: string | number
}
