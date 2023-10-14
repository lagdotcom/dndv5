import { useCallback, useState } from "preact/hooks";

import { MapSquareSize } from "../MapSquare";
import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import Point from "../types/Point";
import { round } from "../utils/numbers";
import styles from "./Battlefield.module.scss";
import BattlefieldEffect from "./BattlefieldEffect";
import usePanning from "./hooks/usePanning";
import Unit from "./Unit";
import classnames from "./utils/classnames";
import {
  actionAreas,
  allCombatants,
  allEffects,
  movingCombatantId,
  scale,
  teleportInfo,
} from "./utils/state";

interface Props {
  onClickBattlefield(pos: Point, e: MouseEvent): void;
  onClickCombatant(who: Combatant, e: MouseEvent): void;
  onMoveCombatant(who: Combatant, dir: MoveDirection): void;
}

export default function Battlefield({
  onClickBattlefield,
  onClickCombatant,
  onMoveCombatant,
}: Props) {
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  const { isPanning, onMouseDown, onMouseEnter, onMouseMove, onMouseUp } =
    usePanning((dx, dy) =>
      setOffset((old) => ({ x: old.x + dx, y: old.y + dy })),
    );

  const convertCoordinate = useCallback((e: MouseEvent) => {
    const x = round(Math.floor(e.pageX / scale.value), MapSquareSize);
    const y = round(Math.floor(e.pageY / scale.value), MapSquareSize);
    return { x, y };
  }, []);

  const onClick = useCallback(
    (e: MouseEvent) => onClickBattlefield(convertCoordinate(e), e),
    [convertCoordinate, onClickBattlefield],
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <main
      className={classnames(styles.main, { [styles.panning]: isPanning })}
      aria-label="Battlefield"
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <div style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        {allCombatants.value.map((unit) => (
          <Unit
            key={unit.id}
            isMoving={movingCombatantId.value === unit.id}
            u={unit}
            onClick={onClickCombatant}
            onMove={onMoveCombatant}
          />
        ))}
        {allEffects.value.map((effect) => (
          <BattlefieldEffect key={effect.id} {...effect} />
        ))}
        {(actionAreas.value ?? []).map((shape, i) => (
          <BattlefieldEffect key={`temp${i}`} shape={shape} top={true} />
        ))}
        {teleportInfo.value && (
          <BattlefieldEffect
            key="teleport"
            shape={teleportInfo.value}
            top={true}
            name="Teleport"
          />
        )}
      </div>
    </main>
  );
}
