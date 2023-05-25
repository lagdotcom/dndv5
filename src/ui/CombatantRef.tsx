import Combatant from "../types/Combatant";
import styles from "./CombatantRef.module.scss";
import { UnitData } from "./utils/types";

interface Props {
  who: Combatant | UnitData;
}

export default function CombatantRef({ who }: Props) {
  return (
    <div className={styles.main}>
      <img className={styles.icon} src={who.img} alt={who.name} />
      <span className={styles.iconLabel} aria-hidden="true">
        {who.name}
      </span>
    </div>
  );
}
