import { useMemo } from "preact/hooks";

import {
  AreaTag,
  SpecifiedCylinder,
  SpecifiedEffectShape,
  SpecifiedSphere,
  SpecifiedWithin,
} from "../types/EffectArea";
import Point from "../types/Point";
import { resolveArea } from "../utils/areas";
import styles from "./BattlefieldEffect.module.scss";
import { scale } from "./utils/state";

function getAuraColour(tags: Set<AreaTag>) {
  if (tags.has("heavily obscured")) return "silver";
  if (tags.has("holy")) return "yellow";
  if (tags.has("plants")) return "green";
}

function Sphere({
  shape,
  name,
  tags,
}: {
  shape: SpecifiedSphere | SpecifiedCylinder;
  name: string;
  tags: Set<AreaTag>;
}) {
  const style = useMemo(() => {
    const size = shape.radius * scale.value;
    return {
      left: shape.centre.x * scale.value - size,
      top: shape.centre.y * scale.value - size,
      width: size * 2,
      height: size * 2,
      borderRadius: size * 2,
      backgroundColor: getAuraColour(tags),
    };
  }, [shape.centre.x, shape.centre.y, shape.radius, tags]);

  return (
    <div className={styles.main} style={style}>
      <div className={styles.label}>{name}</div>
    </div>
  );
}

function WithinArea({
  shape,
  name,
  tags,
}: {
  shape: SpecifiedWithin;
  name: string;
  tags: Set<AreaTag>;
}) {
  const style = useMemo(() => {
    const size = (shape.radius * 2 + shape.target.sizeInUnits) * scale.value;
    return {
      left: (shape.position.x - shape.radius) * scale.value,
      top: (shape.position.y - shape.radius) * scale.value,
      width: size,
      height: size,
      backgroundColor: getAuraColour(tags),
    };
  }, [
    shape.position.x,
    shape.position.y,
    shape.radius,
    shape.target.sizeInUnits,
    tags,
  ]);

  return (
    <div className={styles.main} style={style}>
      <div className={styles.label}>{name}</div>
    </div>
  );
}

interface AffectedSquareProps {
  shape: SpecifiedEffectShape;
  point: Point;
}

function AffectedSquare({ point }: AffectedSquareProps) {
  const style = useMemo(
    () => ({
      left: point.x * scale.value,
      top: point.y * scale.value,
      width: scale.value * 5,
      height: scale.value * 5,
    }),
    [point]
  );

  return <div className={styles.square} style={style} />;
}

interface Props {
  name?: string;
  shape: SpecifiedEffectShape;
  tags?: Set<AreaTag>;
}

export default function BattlefieldEffect({
  name = "Pending",
  shape,
  tags = new Set(),
}: Props) {
  const main = useMemo(() => {
    switch (shape.type) {
      case "cylinder": // TODO [HEIGHT]
      case "sphere":
        return <Sphere name={name} tags={tags} shape={shape} />;

      // TODO line
      // TODO cone

      case "within":
        return <WithinArea name={name} tags={tags} shape={shape} />;
    }
  }, [name, shape, tags]);
  const points = useMemo(() => Array.from(resolveArea(shape)), [shape]);

  return (
    <>
      {main}
      {points.map((p, i) => (
        <AffectedSquare key={i} shape={shape} point={p} />
      ))}
    </>
  );
}
