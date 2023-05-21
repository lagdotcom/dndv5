import Combatant from "../types/Combatant";
import styles from "./ActiveUnitPanel.module.scss";
import { activeCombatant, allActions } from "./state";

interface Props {
  onPass(): void;
  who: Combatant;
}

function ActiveUnitPanel({ onPass, who }: Props) {
  return (
    <aside className={styles.main}>
      <div>
        <div>Current Turn:</div>
        <div>{who.name}</div>
      </div>
      <button onClick={onPass}>Pass</button>
      <hr />
      <div>
        {allActions.value.map((action) => (
          <button key={action.name}>{action.name}</button>
        ))}
      </div>
    </aside>
  );
}

export default function ActiveUnitPanelContainer(props: Omit<Props, "who">) {
  const who = activeCombatant.value;
  if (!who) return null;

  return <ActiveUnitPanel {...props} who={who} />;
}
