import { useState, useCallback } from 'react';
import uniq from 'lodash/uniq';

export default function useUniq() {
  const [state, setState] = useState([]);

  const setStateUniq = useCallback((newState) => {
    if (typeof newState === 'function') {
      setState((oldState) => {
        return uniq(newState(oldState));
      });
    } else {
      setState(uniq(newState));
    }
  }, []);

  return [state, setStateUniq];
}
