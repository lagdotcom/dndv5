import { useCallback } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

import styles from "./RangeInput.module.scss";

interface Props {
  value: number;
  onChange(value: number): void;
  min: number;
  max: number;
}

export default function RangeInput({ value, onChange, min, max }: Props) {
  const changed = useCallback(
    (e: JSXInternal.TargetedEvent<HTMLInputElement>) =>
      onChange(e.currentTarget.valueAsNumber),
    [onChange],
  );

  return (
    <div className={styles.main}>
      <div className={styles.min}>{min}</div>
      <input
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={changed}
      />
      <div className={styles.max}>{max}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}
