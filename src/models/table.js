const defaultParamsHandle = (params, pageNo, pageSize) => ({
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

const doFetch = async (action, params, pageNo, pageSize, paramsHandle, resultHandle) => {
  const [success, result] = await action(
    paramsFilter(paramsHandle || defaultParamsHandle(params, pageNo, pageSize))
  )
  if (success) {
    if (resultHandle) {
      const handleResult = resultHandle(result)
      return handleResult
    }
    return result
  }
  return {
    list: [],
    pageNo: 1,
    pageSize: 10,
    total: 0
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
          action, params, pageNo, pageSize, paramsHandle, resultHandle
        )
        yield put({ type: 'init', payload: { ...nextPayload, ...result } })
      } else {
        yield put({ type: 'init', payload: nextPayload })
      }
    },
    *updateParams({ params: newParams = {} }, { select, put }) {
      const table = yield select(state => state.table)
      const {
        action, params, pageSize, paramsHandle, resultHandle
      } = table
      console.log(newParams)
      const nextParams = {
        ...params, ...newParams
      }
      if (typeof action === 'function') {
        yield put({ type: 'update', payload: { inLoading: true } })
        const result = yield doFetch(
          action, nextParams, 1, pageSize, paramsHandle, resultHandle
        )
        yield put({
          type: 'update', payload: {
            inLoading: false,
            pageNo: 1,
            params: nextParams,
            ...result
          }
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
        resultHandle
      )
      yield put({
        type: 'update',
        payload: { inLoading: false, pageNo, pageSize, ...result }
      })
    },
    *refreshTable(...args) {
      const r = yield args[1].select(state => state.table)
      console.log(r)
      yield args[1].put({ type: 'init', payload: getDefaultState() })
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
