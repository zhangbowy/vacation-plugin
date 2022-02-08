import { useRef, useCallback } from 'react';

function useExternalPromise() {
  const isInitRef = useRef(false);
  const externalPromiseRef = useRef();
  const externalPromiseResolveRef = useRef();
  const externalPromiseRejectRef = useRef();

  const initPromise = useCallback(() => {
    externalPromiseRef.current = new Promise((resolve, reject) => {
      externalPromiseResolveRef.current = resolve;
      externalPromiseRejectRef.current = reject;
    });
  }, []);

  if (!isInitRef.current) {
    isInitRef.current = true;
    initPromise();
  }

  return [
    externalPromiseRef.current,
    {
      initPromise,
      resolve: externalPromiseResolveRef.current,
      reject: externalPromiseRejectRef.current,
    },
  ];
}

export default useExternalPromise;
