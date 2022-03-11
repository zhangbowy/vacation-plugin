import 'react-redux';

declare module 'react-redux' {
  interface DefaultRootState {
    table: {
      name: string;
      inLoading: boolean;
      params: Record<string, unknown>;
      pageNo: number;
      pageSize: number;
      total: number;
      action: any;
      columns: object[];
      list: any[];
      paramsHandle: VoidFunction | null;
      resultHandle: VoidFunction | null;
    };
    rules: {
      hasLieuLeave: any;
      isCopy: any;
      editInfo: any;
      isShowAddPop: boolean;
    };
    login: {};
  }
}
