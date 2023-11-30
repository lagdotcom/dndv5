import { Stable } from "../../effects";
import classnames from "../utils/classnames";
import { UnitData } from "../utils/types";
import styles from "./UnitHP.module.scss";

interface Props {
  u: UnitData;
}

function UnitDeathSaves({ u }: Props) {
  return (
    <div className={classnames(styles.hp, styles.down)}>
      <div className={styles.text}>
        Down: <span className={styles.success}>{u.deathSaveSuccesses}</span> /{" "}
        <span className={styles.failure}>{u.deathSaveFailures}</span>
      </div>
    </div>
  );
}

function UnitStable() {
  return (
    <div className={classnames(styles.hp, styles.down)}>
      <span className={styles.text}>Stable</span>
    </div>
  );
}

export function UnitDetailedHP({ u }: Props) {
  if (u.effects.find((e) => e.effect === Stable)) return <UnitStable />;
  if (u.hp <= 0) return <UnitDeathSaves u={u} />;

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
