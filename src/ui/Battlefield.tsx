import Combatant from "../types/Combatant";
import styles from "./Battlefield.module.scss";
import { activeCombatant, aliveCombatants } from "./state";
import Unit from "./Unit";

interface Props {
  onClickBattlefield(e: MouseEvent): void;
  onClickCombatant(who: Combatant, e: MouseEvent): void;
  onMoveCombatant(who: Combatant, dx: number, dy: number): void;
}

export default function Battlefield({
  onClickBattlefield,
  onClickCombatant,
  onMoveCombatant,
}: Props) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.main} onClick={onClickBattlefield}>
      {aliveCombatants.value.map(({ who, state }) => (
        <Unit
          key={who.id}
          isActive={activeCombatant.value === who}
          who={who}
          scale={20}
          state={state}
          onClick={onClickCombatant}
          onMove={onMoveCombatant}
        />
      ))}
    </div>
  );
}
