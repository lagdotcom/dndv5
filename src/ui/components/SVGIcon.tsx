import { ClassName, Color, Pixels, Url } from "../../flavours";
import { useContext, useEffect, useRef } from "../lib";
import { SVGCacheContext } from "../utils/SVGCache";

interface Props {
  className?: ClassName;
  color?: Color;
  size: Pixels;
  src: Url;
}

export default function SVGIcon({ className, color, size, src }: Props) {
  const cache = useContext(SVGCacheContext);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    void cache.get(src).then((html) => {
      if (ref.current) ref.current.innerHTML = html;
      return html;
    });
  }, [cache, src]);

  return (
    <div
      ref={ref}
      className={className}
      aria-hidden={true}
      style={{ color, width: size, height: size }}
    />
  );
}
