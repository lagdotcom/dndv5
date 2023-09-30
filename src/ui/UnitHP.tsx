import styles from "./UnitHP.module.scss";
import classnames from "./utils/classnames";
import { UnitData } from "./utils/types";

interface Props {
  u: UnitData;
}

export function UnitDetailedHP({ u }: Props) {
  const width = `${(u.hp * 100) / u.hpMax}%`;

  return (
    <div className={classnames(styles.hp, styles.detailed)}>
      <span className={styles.detailedBar} style={{ width }} />
      <span className={styles.text}>
        {u.hp}
        {u.temporaryHP > 0 ? "+" : ""} / {u.hpMax}
      </span>
    </div>
  );
}

const BriefData = {
  OK: "ok",
  Bloody: "bloody",
  Down: "down",
};

export function UnitBriefHP({ u }: Props) {
  const ratio = u.hp / u.hpMax;
  const status = ratio >= 0.5 ? "OK" : ratio > 0 ? "Bloody" : "Down";

  return (
    <div
      className={classnames(styles.hp, styles.brief, styles[BriefData[status]])}
    >
      <span className={styles.text}>
        {status}
        {u.temporaryHP > 0 ? "+" : ""}
      </span>
    </div>
  );
}
