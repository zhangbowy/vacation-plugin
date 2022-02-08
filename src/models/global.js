const GlobalModel = {
  namespace: 'global',

  state: {
    header: {
      activeKey: '',

      tabListProps: [],
    },
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
  },
};

export default GlobalModel;
