import { useCallback } from "preact/hooks";

import Combatant from "../types/Combatant";
import Point from "../types/Point";
import { round } from "../utils/numbers";
import styles from "./Battlefield.module.scss";
import BattlefieldEffect from "./BattlefieldEffect";
import { activeCombatant, allCombatants, allEffects, scale } from "./state";
import Unit from "./Unit";

interface Props {
  onClickBattlefield(pos: Point, e: MouseEvent): void;
  onClickCombatant(who: Combatant, e: MouseEvent): void;
  onMoveCombatant(who: Combatant, dx: number, dy: number): void;
}

export default function Battlefield({
  onClickBattlefield,
  onClickCombatant,
  onMoveCombatant,
}: Props) {
  const convertCoordinate = useCallback((e: MouseEvent) => {
    const x = round(Math.floor(e.offsetX / scale.value), 5);
    const y = round(Math.floor(e.offsetY / scale.value), 5);
    return { x, y };
  }, []);

  const onClick = useCallback(
    (e: MouseEvent) => onClickBattlefield(convertCoordinate(e), e),
    [convertCoordinate, onClickBattlefield]
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <main className={styles.main} aria-label="Battlefield" onClick={onClick}>
      {allCombatants.value.map(({ who, state }) => (
        <Unit
          key={who.id}
          isActive={activeCombatant.value === who}
          who={who}
          state={state}
          onClick={onClickCombatant}
          onMove={onMoveCombatant}
        />
      ))}
      {allEffects.value.map((effect) => (
        <BattlefieldEffect key={effect.id} effect={effect} />
      ))}
    </main>
  );
}
