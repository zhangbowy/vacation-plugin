const RulesModel = {
  namespace: 'rules',

  state: {
    isShowAddPop: false,
    editInfo: null,
  },

  effects: {},

  reducers: {
    updateState(_state, { payload }) {
      return {
        ..._state,
        ...payload,
      };
    },
  },
};

export default RulesModel;
