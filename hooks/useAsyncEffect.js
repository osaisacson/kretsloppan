import { useEffect } from 'react';

function useAsyncEffect(asyncCallbackFn, dependencies) {
  useEffect(() => {
    const cleanupPromise = asyncCallbackFn();

    return () => cleanupPromise.then((cleanupFn) => cleanupFn && cleanupFn());
  }, dependencies);
}

export default useAsyncEffect;
