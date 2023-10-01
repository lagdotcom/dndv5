import Combatant from "../types/Combatant";
import styles from "./CombatantRef.module.scss";
import classnames from "./utils/classnames";
import { UnitData } from "./utils/types";

interface Props {
  who: Combatant | UnitData;
  spaceBefore?: boolean;
}

export default function CombatantRef({ who, spaceBefore = false }: Props) {
  return (
    <div
      className={classnames(styles.main, { [styles.spaceBefore]: spaceBefore })}
    >
      <img className={styles.icon} src={who.img} alt={who.name} />
      <span className={styles.iconLabel} aria-hidden="true">
        {who.name}
      </span>
    </div>
  );
}
