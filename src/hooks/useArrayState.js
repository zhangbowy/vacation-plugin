import { useState, useCallback } from 'react';

export default function useArrayState(initState = []) {
  const [state, setState] = useState(initState);

  const deleteState = useCallback((record) => {
    setState((oldState) => {
      return oldState.filter((item) => item !== record);
    });
  }, []);

  const pushState = useCallback((record) => {
    setState((oldState) => {
      return [...oldState, record];
    });
  }, []);

  const replaceState = useCallback((record, newRecord) => {
    setState((oldState) => {
      return oldState?.map?.((item) => (item === record ? newRecord : item));
    });
  }, []);

  const replaceByUniqueState = useCallback((newRecord, uniqueKey) => {
    setState((oldState) => {
      return oldState?.map?.((item) =>
        item[uniqueKey] === newRecord[uniqueKey] ? newRecord : item,
      );
    });
  }, []);

  return [
    state,
    {
      deleteState,
      pushState,
      setState,
      replaceState,
      replaceByUniqueState,
    },
  ];
}
