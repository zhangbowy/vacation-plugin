const RulesModel = {
  namespace: 'rules',

  state: {
    isShowAddPop: false,
  },

  effects: {},

  reducers: {
    updateState(_state, { payload }) {
      console.log(payload, 'payload');
      return {
        ..._state,
        ...payload,
      };
    },
  },
};

export default RulesModel;
