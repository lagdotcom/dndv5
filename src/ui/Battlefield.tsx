import { useMemo } from "preact/hooks";

import Combatant from "../types/Combatant";
import CombatantState from "../types/CombatantState";
import styles from "./Battlefield.module.scss";
import Unit from "./Unit";

interface Props {
  active?: Combatant;
  onClickBattlefield(e: MouseEvent): void;
  onClickCombatant(who: Combatant, e: MouseEvent): void;
  onMoveCombatant(who: Combatant, dx: number, dy: number): void;
  units: Map<Combatant, CombatantState>;
}

export default function Battlefield({
  active,
  onClickBattlefield,
  onClickCombatant,
  onMoveCombatant,
  units,
}: Props) {
  const unitElements = useMemo(() => {
    const elements = [];
    for (const [who, state] of units)
      elements.push(
        <Unit
          key={who.id}
          isActive={active === who}
          who={who}
          scale={20}
          state={state}
          onClick={onClickCombatant}
          onMove={onMoveCombatant}
        />
      );
    return elements;
  }, [active, onClickCombatant, onMoveCombatant, units]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.main} onClick={onClickBattlefield}>
      {unitElements}
    </div>
  );
}
