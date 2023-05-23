import { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

import styles from "./Labelled.module.scss";

interface Props {
  children: ComponentChildren;
  label: string;
  role?: JSXInternal.AriaRole;
}

export default function Labelled({ children, label, role = "group" }: Props) {
  const labelId = useId();

  return (
    <div className={styles.main} role={role} aria-labelledby={labelId}>
      <div id={labelId} className={styles.label} aria-hidden="true">
        {label}
      </div>
      {children}
    </div>
  );
}
