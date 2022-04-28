import { createContext, useReducer, useMemo, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { handleList, handleSearch } from './methods';
import reducer from './reducer';

interface ReducerProps {
  topName: string;
  dispDeptId: string | null;
  options: AddressList;
  value: AddressList;
  type: 'complex' | 'user' | 'dept';
  searchString: string;
  paths: AddressDepts;
  selectMode?: 'multiple' | 'single';
  showCompany?: boolean;
  hasPermission?: boolean;
}

const getInitialState = (payload = {}): ReducerProps => ({
  topName: '',
  dispDeptId: null,
  options: { departments: [], users: [] },
  value: { departments: [], users: [] },
  type: 'complex',
  searchString: '',
  paths: [],
  selectMode: 'multiple',
  ...payload,
});

// eslint-disable-next-line
const paramsFunction = (_?: any) => {};
export const context = createContext({
  // eslint-disable-next-line
  dispatch: (_: any) => {},
  state: getInitialState(),
  actions: {
    getList: paramsFunction,
    openDept: paramsFunction,
    changeDept: paramsFunction,
    doSearch: paramsFunction,
  },
});

const ContextProvider: FC = ({ children }) => {
  //@ts-ignore
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const refState = useRef(state);
  useEffect(() => {
    refState.current = state;
  }, [state]);
  const actions = useMemo(() => {
    const _getList = (params: { deptId?: string | number; type: string }) =>
      handleList(params, (options) => {
        //@ts-ignore
        dispatch({ type: 'update options', options });
      });
    return {
      getList: () => {
        const { type, showCompany, topName, hasPermission } = refState.current;
        console.log(hasPermission, 'hasPermission');
        if (showCompany && !hasPermission) {
          dispatch({
            type: 'update options',
            options: {
              departments: [
                {
                  name: topName,
                  deptId: '1',
                },
              ],
              users: [],
            },
          });
          return;
        }
        if (hasPermission) {
          return _getList({ type });
        }
        return _getList({ type, deptId: 1 });
      },
      openDept: (dept: AddressDept) => {
        const { type } = refState.current;
        //@ts-ignore
        dispatch({ type: 'open dept', dept });
        return _getList({ type, deptId: dept.id });
      },
      changeDept: (paths: AddressDepts) => {
        const { type, showCompany, topName, hasPermission } = refState.current;
        //@ts-ignore
        dispatch({ type: 'change paths', paths });
        if (showCompany && paths.length === 0 && !hasPermission) {
          dispatch({
            type: 'update options',
            options: {
              departments: [
                {
                  name: topName,
                  id: '1',
                },
              ],
              users: [],
            },
          });
          return;
        }
        if (hasPermission) {
          return _getList({
            type,
          });
        }
        return _getList({
          type,
          deptId: paths.length > 0 ? paths[paths.length - 1].id : 1,
        });
      },
      doSearch: (search: string) => {
        const { type, showCompany, topName, hasPermission } = refState.current;
        if (search) {
          //@ts-ignore
          dispatch({
            type: 'change search string',
            searchString: search,
          });
          return handleSearch({ type, search }, (options) => {
            //@ts-ignore
            dispatch({
              type: 'update options',
              options,
            });
          });
        } else {
          //@ts-ignore
          dispatch({ type: 'clear search string' });
          if (showCompany && !hasPermission) {
            dispatch({
              type: 'update options',
              options: {
                departments: [
                  {
                    name: topName,
                    id: '1',
                  },
                ],
                users: [],
              },
            });
            return;
          }
          if (hasPermission) {
            return _getList({ type });
          }
          return _getList({
            type,
            deptId: 1,
          });
        }
      },
    };
  }, [dispatch]);
  return <context.Provider value={{ state, dispatch, actions }}>{children}</context.Provider>;
};

export default ContextProvider;
