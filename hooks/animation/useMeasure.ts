import ResizeObserver from 'resize-observer-polyfill';
import { useCallbackRef } from './useCallbackRef';
import { useState, useEffect } from 'react';

export function useMeasure(ref) {
  const [element, attachRef] = useCallbackRef();
  const [bounds, setBounds] = useState<{ height?: number }>({});

  useEffect(() => {
    function onResize([entry]) {
      setBounds({
        height: entry.contentRect.height,
      });
    }

    const observer = new ResizeObserver(onResize);

    if (element && element.current) {
      observer.observe(element.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [element]);

  useEffect(() => {
    attachRef(ref);
  }, [attachRef, ref]);

  return bounds;
}
