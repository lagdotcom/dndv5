import { useMemo } from "preact/hooks";

import SphereEffectArea from "../areas/SphereEffectArea";
import EffectArea from "../types/EffectArea";
import Point from "../types/Point";
import { resolveArea } from "../utils/areas";
import styles from "./BattlefieldEffect.module.scss";
import { scale } from "./state";

function Sphere({ centre, name, radius, tags }: SphereEffectArea) {
  const style = useMemo(() => {
    const size = radius * scale.value;
    return {
      left: centre.x * scale.value - size,
      top: centre.y * scale.value - size,
      width: size * 2,
      height: size * 2,
      borderRadius: size * 2,
      backgroundColor: tags.has("heavily obscured") ? "silver" : undefined,
    };
  }, [centre.x, centre.y, radius, tags]);

  return (
    <div className={styles.main} style={style}>
      <div className={styles.label}>{`${name} Effect`}</div>
    </div>
  );
}

interface AffectedSquareProps {
  effect: EffectArea;
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
  effect: EffectArea;
}

export default function BattlefieldEffect({ effect }: Props) {
  const main = useMemo(() => {
    switch (effect.type) {
      case "sphere":
        return <Sphere {...(effect as SphereEffectArea)} />;
    }
  }, [effect]);
  const points = useMemo(() => resolveArea(effect), [effect]);

  return (
    <>
      {main}
      {points.map((p, i) => (
        <AffectedSquare key={i} effect={effect} point={p} />
      ))}
    </>
  );
}
