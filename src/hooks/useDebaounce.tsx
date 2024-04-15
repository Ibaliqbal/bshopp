import { useState, useEffect } from "react";

const useDebounce = (value: string | undefined, delay: number = 500) => {
  const [debouncedVal, setDebouncedVal] = useState<string | undefined>(value);
  useEffect(() => {
    const search = setTimeout(() => {
      setDebouncedVal(value);
    }, delay);

    return () => {
      clearTimeout(search);
    };
  }, [value, delay]);

  return debouncedVal;
};
export default useDebounce;
