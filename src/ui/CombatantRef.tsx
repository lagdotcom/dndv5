import Combatant from "../types/Combatant";
import styles from "./CombatantRef.module.scss";

export default function CombatantRef({ who }: { who: Combatant }) {
  return (
    <div className={styles.main}>
      <img className={styles.icon} src={who.img} alt={who.name} />
      <span className={styles.iconLabel} aria-hidden="true">
        {who.name}
      </span>
    </div>
  );
}
