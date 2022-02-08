import { useCallback } from 'react';
import { useBoolean } from 'ahooks';

function useRequestWrpperLoading(request) {
  const [state, { setTrue, setFalse }] = useBoolean(false);

  const requestFn = useCallback(
    (...args) => {
      setTrue();
      return request(...args).finally(() => {
        setFalse();
      });
    },
    [request, setTrue, setFalse],
  );

  return [state, requestFn];
}

export default useRequestWrpperLoading;
