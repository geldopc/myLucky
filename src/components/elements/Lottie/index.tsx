import { cn } from "@utils/css";
import * as React from "react";

type LottieProps = {
  src: string;
  className?: string;
  loop?: boolean;
  label: string;
};

export function Lottie({ src, className, loop = true, label }: LottieProps) {
  const host = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = host.current;
    if (!container) return;

    let animation: { destroy: () => void } | null = null;
    let cancelled = false;

    Promise.all([
      import("lottie-web/build/player/lottie_light"),
      fetch(src).then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      }),
    ])
      .then(([module, animationData]) => {
        if (cancelled || !host.current) return;
        const lottie = module.default ?? module;
        animation = lottie.loadAnimation({
          container: host.current,
          renderer: "svg",
          loop,
          autoplay: true,
          animationData,
        });
      })
      .catch(() => {
        // a animação é decorativa: se falhar, o restante do sorteio segue normalmente
      });

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [src, loop]);

  return <div ref={host} role="img" aria-label={label} className={cn("[&_svg]:size-full", className)} />;
}
