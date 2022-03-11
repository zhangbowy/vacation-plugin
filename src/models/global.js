const GlobalModel = {
  namespace: 'global',

  state: {
    header: {
      activeKey: '',

      tabListProps: [],
    },
    contentSize: undefined
  },

  effects: {},

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    updateHeaderInfo(state, { payload }) {
      return {
        ...state,
        header: {
          ...state.header,
          ...payload,
        },
      };
    },

    updateContentSize(state, contentSize) {
      return { ...state, contentSize }
    }
  },
};

export default GlobalModel;
