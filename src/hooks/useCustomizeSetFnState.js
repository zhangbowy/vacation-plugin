import { useState, useCallback } from 'react';

export default function useCustomizeSetFnState(initState, wrapFn) {
  const [state, setState] = useState(initState);

  const setStateWithWrap = useCallback(
    (newState) => {
      if (typeof newState === 'function') {
        setState((oldState) => {
          return wrapFn(newState(oldState));
        });
      } else {
        setState(wrapFn(newState));
      }
    },
    [wrapFn],
  );

  return [state, setStateWithWrap];
}
