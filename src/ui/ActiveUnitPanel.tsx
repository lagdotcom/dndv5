import Action from "../types/Action";
import Combatant from "../types/Combatant";
import styles from "./ActiveUnitPanel.module.scss";
import { allActions } from "./state";

interface Props {
  onChooseAction(action: Action): void;
  onPass(): void;
  who: Combatant;
}

export default function ActiveUnitPanel({
  onChooseAction,
  onPass,
  who,
}: Props) {
  return (
    <aside className={styles.main} aria-label="Active Unit">
      <div>
        <div>Current Turn:</div>
        <div>{who.name}</div>
      </div>
      <button onClick={onPass}>End Turn</button>
      <hr />
      <div>
        {allActions.value.map((action) => (
          <button key={action.name} onClick={() => onChooseAction(action)}>
            {action.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
