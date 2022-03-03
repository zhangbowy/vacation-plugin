import loading from '@/components/pop/loading'

export const defaultParamsHandle = (params, pageNo, pageSize) => ({
  ...(params || {}), pageNo: pageNo || 1, pageSize: pageSize || 10
})

const paramsFilter = obj => {
  if (obj) {
    const r = {};
    Object.keys(obj).forEach(v => {
      if (
        obj[v] !== undefined &&
        obj[v] !== null &&
        obj[v] !== '' &&
        (!Array.isArray(obj[v]) || obj[v].length > 0)
      ) {
        r[v] = obj[v];
      }
    });
    return r;
  }
  return {}
};

const getDefaultState = () =>({
  name: '',
  inLoading: false,
  params: {},
  pageNo: 1,
  pageSize: 10,
  total: 0,
  action: '',
  columns: [],
  list: [],
  paramsHandle: null,
  resultHandle: null
})

let i = 0

const doFetch = async (
  action, params, pageNo, pageSize, paramsHandle, resultHandle, others
) => {
  loading.show()
  const k = ++i
  const [success, result] = await action(
    paramsFilter((paramsHandle || defaultParamsHandle)(params, pageNo, pageSize))
  )
  loading.hide()
  if (k === i) {
    if (success) {
      if (resultHandle) {
        return {
          ...others,
          ...resultHandle(result, pageNo, pageSize)
        }
      }
      const { page = {}, list } = result || {}
      const { currentPage = 1, total = 0 } = page
      return {
        ...others, list, total, pageNo: currentPage, pageSize
      }
    }
    return {
      ...others,
      list: [],
      pageNo: 1,
      pageSize: 10,
      total: 0
    }
  } else {
    return {}
  }
}

const LoginModel = {
  namespace: 'table',

  state: getDefaultState(),

  effects: {
    *initTable({ payload }, { put }) {
      const nextPayload = {
        ...getDefaultState(),
        ...(payload || {}),
        inLoading: false
      }
      if (payload && payload.action) {
        const {
          action,
          params,
          pageNo = 1,
          pageSize = 10,
          paramsHandle = null,
          resultHandle = null
        } = payload
        yield put({
          type: 'update', payload: { inLoading: true, columns: payload.columns }
        })
        const result = yield doFetch(
          action,
          params,
          pageNo,
          pageSize,
          paramsHandle,
          resultHandle,
          nextPayload
        )
        yield put({
          type: 'init', payload: result
        })
      } else {
        yield put({ type: 'init', payload: nextPayload })
      }
    },
    *updateParams({ params: newParams = {} }, { select, put }) {
      const table = yield select(state => state.table)
      const {
        action, params, pageSize, paramsHandle, resultHandle
      } = table
      const nextParams = {
        ...params, ...newParams
      }
      if (typeof action === 'function') {
        yield put({
          type: 'update', payload: { params: nextParams, inLoading: true }
        })
        const result = yield doFetch(
          action,
          nextParams,
          1,
          pageSize,
          paramsHandle,
          resultHandle,
          {
            inLoading: false,
            pageNo: 1,
            params: nextParams
          }
        )
        yield put({
          type: 'update', payload: result
        })
      } else {
        yield put({
          type: 'update', payload: { params: nextParams }
        })
      }
    },
    *updatePage({ pageNo: nextPageNo, pageSize: nextPageSize }, { select, put }) {
      const {
        action, params, pageSize: statePageSize, paramsHandle, resultHandle
      } = yield select(state => state.table)
      const pageNo = nextPageNo || 1
      const pageSize = nextPageSize || statePageSize
      yield put({ type: 'update', payload: { inLoading: true } })
      const result = yield doFetch(
        action,
        params,
        pageNo,
        pageSize,
        paramsHandle,
        resultHandle,
        { inLoading: false, pageNo, pageSize }
      )
      yield put({
        type: 'update',
        payload: result
      })
    },
    *refreshTable(_, { select, put }) {
      const {
        action, params, paramsHandle, resultHandle
      } = yield select(state => state.table)
      yield put({ type: 'update', payload: { inLoading: true } })
      const result = yield doFetch(
        action,
        params,
        1,
        10,
        paramsHandle,
        resultHandle,
        { inLoading: false, pageNo: 1, pageSize: 10 }
      )
      yield put({
        type: 'update',
        payload: result
      })
    }
  },
  reducers: {
    init(_, { payload = {} }) {
      return payload
    },
    update(state, { payload = {} }) {
      return { ...state, ...payload }
    },
    close() {
      return getDefaultState()
    }
  },
}

export default LoginModel
