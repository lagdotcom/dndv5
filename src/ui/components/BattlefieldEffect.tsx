import { MapSquareSize } from "../../MapSquare";
import { AreaTag, SpecifiedEffectShape } from "../../types/EffectArea";
import Point from "../../types/Point";
import { resolveArea } from "../../utils/areas";
import { CSSProperties, useMemo } from "../lib";
import classnames from "../utils/classnames";
import styles from "./BattlefieldEffect.module.scss";

function getAuraColour(tags: Set<AreaTag>) {
  if (tags.has("heavily obscured")) return "silver";
  if (tags.has("holy")) return "yellow";
  if (tags.has("plants")) return "green";
  if (tags.has("dim light")) return "skyblue";
}

interface AffectedSquareProps {
  point: Point;
  scaleValue: number;
  tint: string;
  top?: boolean;
}
export function AffectedSquare({
  point,
  scaleValue,
  tint,
  top = false,
}: AffectedSquareProps) {
  const style = useMemo<CSSProperties>(
    () => ({
      left: point.x * scaleValue,
      top: point.y * scaleValue,
      width: scaleValue * MapSquareSize,
      height: scaleValue * MapSquareSize,
      backgroundColor: tint,
    }),
    [point.x, point.y, scaleValue, tint],
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
  scaleValue: number;
  shape: SpecifiedEffectShape;
  tags?: Set<AreaTag>;
  tint?: string;
  top?: boolean;
}
export default function BattlefieldEffect({
  name = "Pending",
  scaleValue,
  shape,
  tags = new Set(),
  top: onTop = false,
  tint = getAuraColour(tags),
}: Props) {
  const { points, left, top } = useMemo(() => {
    const points = resolveArea(shape);
    const { x: left, y: top } = points.average(scaleValue);
    return { points, left, top };
  }, [scaleValue, shape]);

  const squares = Array.from(points, (p, key) => (
    <AffectedSquare
      key={key}
      point={p}
      tint={tint ?? "silver"}
      top={onTop}
      scaleValue={scaleValue}
    />
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
