import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handleChange = (e) => setIsMobile(e.matches);

    mql.addEventListener("change", handleChange);
    setIsMobile(mql.matches);

    return () => mql.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMobile;
}
