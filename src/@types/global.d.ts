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
declare type AddressDept = { id: string, name: string }
declare type AddressDepts = Dept[]
declare type AddressUser = { id: string, name: string, avatar?: string }
declare type AddressUsers = User[]
declare type AddressList = {
  departments: Depts,
  users: Users
}
