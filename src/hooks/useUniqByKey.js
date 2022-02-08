import { useState, useCallback } from 'react';
import uniqBy from 'lodash/uniqBy';

export default function useUniqByKey(key, defaultState = []) {
  const [state, setState] = useState(defaultState);

  const setStateByUnique = useCallback(
    (newState) => {
      if (typeof newState === 'function') {
        setState((oldState) => {
          return uniqBy(newState(oldState), key);
        });
      } else {
        setState(uniqBy(newState, key));
      }
    },
    [key],
  );

  const removeStateByUnique = useCallback(
    (val) => {
      setState((oldState) => {
        return oldState.filter((item) => item[key] !== val);
      });
    },
    [key],
  );

  return [state, { setState: setStateByUnique, removeState: removeStateByUnique }];
}
