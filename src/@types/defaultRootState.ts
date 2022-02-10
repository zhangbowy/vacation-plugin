import 'react-redux';

declare module 'react-redux' {
  interface DefaultRootState {
    table: {
      inLoading: boolean,
      params: Record<string, unknown>,
      pageNo: number,
      pageSize: number,
      total: number,
      action: any,
      columns: object[],
      list: any[],
      paramsHandle: VoidFunction | null,
      resultHandle: VoidFunction | null
    }
  }
}
