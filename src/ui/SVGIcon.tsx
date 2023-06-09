import { useEffect, useRef } from "preact/hooks";

import cachedFetch from "./utils/fetchCache";

interface Props {
  className?: string;
  color?: string;
  size: number;
  src: string;
}

export default function SVGIcon({ className, color, size, src }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    void cachedFetch(src).then((html) => {
      if (ref.current) ref.current.innerHTML = html;
      return html;
    });
  }, [src]);

  return (
    <div
      ref={ref}
      className={className}
      aria-hidden={true}
      style={{ color, width: size, height: size }}
    />
  );
}
