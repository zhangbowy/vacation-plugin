import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { get } from 'lodash';

const initStatusMap = {};

function useBaseDispatch(options = {}) {
  const { isInit = true, path, defaultValue, forceUpdata, type } = options;
  const dispatch = useDispatch();
  const state = useSelector((data) => get(data, path, defaultValue || []));

  const launchDispatch = useCallback(() => {
    // 数据不存在 或者 强制更新时，才去请求数据
    if (forceUpdata || !state || (Array.isArray(state) && !state.length)) {
      dispatch({
        type,
      });
    }
  }, [dispatch, forceUpdata, state, type]);

  useEffect(() => {
    if (isInit && !initStatusMap[type]) {
      initStatusMap[type] = true;
      launchDispatch();
    }
  }, [isInit, launchDispatch, type]);

  return [
    state,
    {
      dispatch: launchDispatch,
    },
  ];
}

export function useSystemResourceList(options = {}) {
  const [data, { dispatch }] = useBaseDispatch({
    ...options,
    path: 'xxx.x',
    type: 'xxx/x',
  });

  return [
    data,
    {
      dispatch,
    },
  ];
}
