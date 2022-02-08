import { useState, useRef, useCallback } from 'react';
import _get from 'lodash/get';

const defaultFormatRequestData = (v) => v;

function useTableRequest({
  request,
  dataPath = 'data.list',
  totalPath = 'data.total',
  params: expandParams = {},
  formatRequestData = defaultFormatRequestData,
}) {
  const dataRef = useRef([]);
  const [tableParams, setTableParams] = useState(expandParams);

  // table 数据源请求
  const requestCallback = useCallback(
    async (params) => {
      const { current } = params;
      const newParams = {
        ...params,
      };

      newParams.pageNum = current;

      delete newParams.current;

      const [error, result] = await request(newParams);

      if (error)
        return {
          data: [],
          success: false,
          total: 0,
        };

      dataRef.current = _get(result, dataPath);

      return Promise.resolve(
        formatRequestData({
          data: dataRef.current,
          success: true,
          total: _get(result, totalPath),
        }),
      );
    },
    [dataPath, formatRequestData, request, totalPath],
  );

  return [
    requestCallback,
    {
      tableParams,
      setTableParams,
      getData() {
        return dataRef.current;
      },
    },
  ];
}

export default useTableRequest;
