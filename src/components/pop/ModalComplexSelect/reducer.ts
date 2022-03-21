interface ReducerProps {
  topName: string
  dispDeptId: string | null
  options: AddressList
  value: AddressList
  type: 'complex' | 'user' | 'dept'
  searchString: string
  paths: AddressDepts
  selectMode?: 'multiple' | 'single'
}

const getInitialState = (payload = {}) => ({
  topName: '',
  dispDeptId: null,
  options: { departments: [], users: [] },
  value: { departments: [], users: [] },
  type: 'complex',
  searchString: '',
  paths: [],
  selectMode: 'multiple',
  ...payload
})

export default (state: ReducerProps, action: any) => {
  switch (action.type) {
    case 'reset':
      return getInitialState(action.payload)
    case 'open dept':
      return {
        ...state,
        paths: [
          ...state.paths,
          { ...action.dept }
        ],
        searchString: ''
      }
    case 'set item':
      return {
        ...state,
        value: action.value
      }
    case 'update options':
      return {
        ...state,
        options: action.options
      }
    case 'change paths':
      return {
        ...state,
        paths: action.paths
      }
    case 'change search string':
      return {
        ...state,
        searchString: action.searchString
      }
    case 'clear search string':
      return {
        ...state,
        searchString: '',
        paths: []
      }
    case 'remove item':
       if (action.itemType === 'user') {
        const index = action.index
        const users = state.value.users
        return {
          ...state,
          value: {
            users: [
              ...users.slice(0, index),
              ...users.slice(index + 1)
            ],
            departments: state.value.departments
          }
        }
       } else {
        const index = action.index
        const departments = state.value.departments
        return {
          ...state,
          value: {
            users: state.value.users,
            departments: [
              ...departments.slice(0, index),
              ...departments.slice(index + 1)
            ]
          }
        }
       }
    case 'batch add':
      return {
        ...state,
        value: {
          users: [
            ...state.value.users,
            ...action.users
          ],
          departments: [
            ...state.value.departments,
            ...action.departments
          ]
        }
      }
    case 'update value':
      return {
        ...state,
        value: {
          users: action.users,
          departments: action.departments
        }
      }
    case 'add item':
      if (action.itemType === 'user') {
        return {
          ...state,
          value: {
            users: [
              ...state.value.users,
              action.item
            ],
            departments: state.value.departments
          }
        }
      } else {
        return {
          ...state,
          value: {
            users: state.value.users,
            departments: [
              ...state.value.departments,
              action.item
            ]
          }
        }
      }
    default:
      return state
  }
}
