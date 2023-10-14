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
  top: onTop = false,
  tint = getAuraColour(tags),
}: Props) {
  const { points, left, top } = useMemo(() => {
    const points = resolveArea(shape);
    const { x: left, y: top } = points.average(scale.value);
    return { points, left, top };
  }, [shape]);

  const squares = Array.from(points, (p, key) => (
    <AffectedSquare key={key} point={p} tint={tint ?? "silver"} top={onTop} />
  ));

  return (
    <>
      <div
        className={classnames(styles.main, { [styles.top]: onTop })}
        style={{ left, top }}
      >
        {name}
      </div>
      {squares}
    </>
  );
}
