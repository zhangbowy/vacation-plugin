import { createContext, useReducer, useMemo, useRef, useEffect } from 'react'
import type { FC } from 'react'
import { handleList, handleSearch } from './methods'
import reducer from './reducer'

type Dept = { id: string, name: string }
type Depts = Dept[]
type User = { id: string, name: string, avatar?: string }
type Users = User[]

interface ReducerProps {
  topName: string
  dispDeptId: string | null
  options: {
    departments: Depts,
    users: Users
  }
  value: {
    departments: Depts,
    users: Users
  }
  type: 'complex' | 'user' | 'dept'
  searchString: string
  paths: Depts
}

const getInitialState = (payload = {}): ReducerProps => ({
  topName: '',
  dispDeptId: null,
  options: { departments: [], users: [] },
  value: { departments: [], users: [] },
  type: 'complex',
  searchString: '',
  paths: [],
  ...payload
})

// eslint-disable-next-line
const paramsFunction = (_?: any) => new Promise((resolve) => { resolve({}) })
export const context = createContext({
  // eslint-disable-next-line
  dispatch: (_: any) => {},
  state: getInitialState(),
  actions: {
    getList: paramsFunction,
    openDept: paramsFunction,
    changeDept: paramsFunction,
    doSearch: paramsFunction
  }
})

const ContextProvider: FC = ({ children }) => {
  //@ts-ignore
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const refState = useRef(state)
  useEffect(
    () => {
      refState.current = state
    },
    [state]
  )
  const actions = useMemo(
    () => {
      const _getList = (params: { deptId?: string | number, type: string }) =>
        handleList(
          params,
          options => {
            dispatch({ type: 'update options', options })
          }
        )
      return {
        getList: () => {
          const { type } = refState.current
          return _getList({ type, deptId: 1 })
        },
        openDept: (dept: Dept) => {
          const { type } = refState.current
          dispatch({ type: 'open dept', dept })
          return _getList({ type, deptId: dept.id })
        },
        changeDept: (paths: Depts) => {
          const { type } = refState.current
          dispatch({ type: 'change paths', paths })
          return _getList({
            type,
            deptId: paths.length > 0 ? paths[paths.length - 1].id : 1
          })
        },
        doSearch: (search: string) => {
          const { type } = refState.current
          if (search) {
            dispatch({
              type: 'change search string',
              searchString: search
            })
            return handleSearch(
              { type, search },
              options => {
                dispatch({
                  type: 'update options',
                  options
                })
              }
            )
          } else {
            dispatch({ type: 'clear search string' })
            return _getList({
              type,
              deptId: 1
            })
          }
        }
      }
    },
    [dispatch]
  )
  return (
    <context.Provider value={{ state, dispatch, actions }}>
      { children }
    </context.Provider>
  )
}

export default ContextProvider
