import { useCallback } from "preact/hooks";

import { MapSquareSize } from "../MapSquare";
import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import Point from "../types/Point";
import { round } from "../utils/numbers";
import styles from "./Battlefield.module.scss";
import BattlefieldEffect from "./BattlefieldEffect";
import Unit from "./Unit";
import {
  actionAreas,
  allCombatants,
  allEffects,
  movingCombatantId,
  scale,
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
  const convertCoordinate = useCallback((e: MouseEvent) => {
    const x = round(Math.floor(e.pageX / scale.value), MapSquareSize);
    const y = round(Math.floor(e.pageY / scale.value), MapSquareSize);
    return { x, y };
  }, []);

  const onClick = useCallback(
    (e: MouseEvent) => onClickBattlefield(convertCoordinate(e), e),
    [convertCoordinate, onClickBattlefield]
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <main className={styles.main} aria-label="Battlefield" onClick={onClick}>
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
        <BattlefieldEffect key={`temp${i}`} shape={shape} />
      ))}
    </main>
  );
}
