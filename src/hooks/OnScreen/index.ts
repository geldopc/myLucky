import * as React from "react";

export function useOnScreen<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}
