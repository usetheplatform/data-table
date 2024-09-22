import debounce from "lodash.debounce";
import { useEffect, useMemo, useRef } from "react";

export const useDebounce = <T extends unknown[], S>(
  callback: (...args: T) => S,
  delay = 500,
) => {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...arg: T) => {
      return ref.current(...arg);
    };

    return debounce(func, delay);
  }, [delay]);

  return debouncedCallback;
};
