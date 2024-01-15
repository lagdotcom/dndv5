import { ClassName } from "../../flavours";
import { AriaRole, ComponentChildren, useId } from "../lib";
import classnames from "../utils/classnames";
import styles from "./Labelled.module.scss";

interface Props {
  children: ComponentChildren;
  label: string;
  labelClass?: ClassName;
  contentsClass?: ClassName;
  role?: AriaRole;
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
