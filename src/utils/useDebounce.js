import { useEffect, useState } from "react";

export function useDebounce(valor, delay = 300) {
  const [valorDebounce, setValorDebounce] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValorDebounce(valor);
    }, delay);

    return () => clearTimeout(timer);
  }, [valor, delay]);

  return valorDebounce;
}