import Action from "../types/Action";
import Combatant from "../types/Combatant";
import styles from "./ActiveUnitPanel.module.scss";
import Labelled from "./Labelled";
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
      <Labelled label="Current Turn">{who.name}</Labelled>
      <button onClick={onPass}>End Turn</button>
      <hr />
      <Labelled label="Actions">
        {allActions.value.map((action) => (
          <button key={action.name} onClick={() => onChooseAction(action)}>
            {action.name}
          </button>
        ))}
      </Labelled>
    </aside>
  );
}
