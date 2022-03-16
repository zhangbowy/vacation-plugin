import { createContext, useReducer } from 'react'
import type { FC } from 'react'

interface ReducerProps {
  topName: string
  dispDeptId: string | null
  options: {
    departments: { id: string, name: string }[],
    users: { id: string, name: string, avatar?: string }[]
  }
  value: {
    departments: { id: string, name: string }[],
    users: { id: string, name: string, avatar?: string }[]
  }
  type: 'complex' | 'user' | 'dept'
  searchString: string
}

const getInitialState = (payload = {}): ReducerProps => ({
  topName: '',
  dispDeptId: null,
  options: { departments: [], users: [] },
  value: { departments: [], users: [] },
  type: 'complex',
  searchString: '',
  ...payload
})

export const context = createContext({
  // eslint-disable-next-line
  dispatch: (_: any) => {},
  state: getInitialState()
})

export const reducer = (state: ReducerProps, action: any) => {
  console.log('what ffff')
  console.log(state)
  console.log(action)
  switch (action.type) {
    case 'reset':
      return getInitialState(action.payload)
    case 'start search':
      console.log(action.searchString)
      return state
    default:
      return state
  }
}

const ContextProvider: FC = ({ children }) => {
  //@ts-ignore
  const [state, dispatch] = useReducer(reducer, getInitialState())
  return (
    <context.Provider value={{ state, dispatch }}>
      { children }
    </context.Provider>
  )
}

export default ContextProvider
