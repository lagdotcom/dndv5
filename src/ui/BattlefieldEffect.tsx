import { useMemo } from "preact/hooks";

import {
  AreaTag,
  SpecifiedEffectShape,
  SpecifiedSphere,
} from "../types/EffectArea";
import Point from "../types/Point";
import { resolveArea } from "../utils/areas";
import styles from "./BattlefieldEffect.module.scss";
import { scale } from "./utils/state";

function Sphere({
  shape,
  name,
  tags,
}: {
  shape: SpecifiedSphere;
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
      backgroundColor: tags.has("heavily obscured") ? "silver" : undefined,
    };
  }, [shape.centre.x, shape.centre.y, shape.radius, tags]);

  return (
    <div className={styles.main} style={style}>
      <div className={styles.label}>{`${name} Effect`}</div>
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
  shape: SpecifiedEffectShape;
  tags?: Set<AreaTag>;
}

export default function BattlefieldEffect({ shape, tags = new Set() }: Props) {
  const main = useMemo(() => {
    switch (shape.type) {
      case "sphere":
        return <Sphere name="Pending" tags={tags} shape={shape} />;
    }
  }, [shape, tags]);
  const points = useMemo(() => resolveArea(shape), [shape]);

  return (
    <>
      {main}
      {points.map((p, i) => (
        <AffectedSquare key={i} shape={shape} point={p} />
      ))}
    </>
  );
}
