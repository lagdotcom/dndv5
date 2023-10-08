import { useMemo } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

import { MapSquareSize } from "../MapSquare";
import { AreaTag, SpecifiedEffectShape } from "../types/EffectArea";
import Point from "../types/Point";
import { resolveArea } from "../utils/areas";
import styles from "./BattlefieldEffect.module.scss";
import classnames from "./utils/classnames";
import { scale } from "./utils/state";

function getAuraColour(tags: Set<AreaTag>) {
  if (tags.has("heavily obscured")) return "silver";
  if (tags.has("holy")) return "yellow";
  if (tags.has("plants")) return "green";
  if (tags.has("dim light")) return "skyblue";
}

interface AffectedSquareProps {
  point: Point;
  tint: string;
  top?: boolean;
}
function AffectedSquare({ point, tint, top = false }: AffectedSquareProps) {
  const style = useMemo<JSXInternal.CSSProperties>(
    () => ({
      left: point.x * scale.value,
      top: point.y * scale.value,
      width: scale.value * MapSquareSize,
      height: scale.value * MapSquareSize,
      backgroundColor: tint,
    }),
    [point.x, point.y, tint],
  );

  return (
    <div
      className={classnames(styles.square, { [styles.top]: top })}
      style={style}
    />
  );
}

interface Props {
  name?: string;
  shape: SpecifiedEffectShape;
  tags?: Set<AreaTag>;
  tint?: string;
  top?: boolean;
}

export default function BattlefieldEffect({
  name = "Pending",
  shape,
  tags = new Set(),
  top = false,
  tint = getAuraColour(tags),
}: Props) {
  const { points, style } = useMemo(() => {
    const points = Array.from(resolveArea(shape));
    let cx = 0;
    let cy = 0;
    for (const p of points) {
      cx += p.x + MapSquareSize / 2;
      cy += p.y + MapSquareSize / 2;
    }

    const left = (cx / points.length) * scale.value;
    const top = (cy / points.length) * scale.value;

    const style: JSXInternal.CSSProperties = { left, top };

    return { points, style };
  }, [shape]);

  return (
    <>
      <div
        className={classnames(styles.main, { [styles.top]: top })}
        style={style}
      >
        {name}
      </div>
      {points.map((p, i) => (
        <AffectedSquare key={i} point={p} tint={tint ?? "silver"} top={top} />
      ))}
    </>
  );
}
