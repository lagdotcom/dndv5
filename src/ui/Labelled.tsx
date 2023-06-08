import { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

import styles from "./Labelled.module.scss";
import classnames from "./utils/classnames";

interface Props {
  children: ComponentChildren;
  label: string;
  labelClass?: string;
  contentsClass?: string;
  role?: JSXInternal.AriaRole;
}

export default function Labelled({
  children,
  label,
  labelClass,
  contentsClass,
  role = "group",
}: Props) {
  const labelId = useId();

  return (
    <div className={styles.main} role={role} aria-labelledby={labelId}>
      <div
        id={labelId}
        className={classnames(styles.label, labelClass)}
        aria-hidden="true"
      >
        {label}
      </div>
      <div className={classnames(styles.contents, contentsClass)}>
        {children}
      </div>
    </div>
  );
}
