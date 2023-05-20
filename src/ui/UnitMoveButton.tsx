import { useCallback, useMemo } from "preact/hooks";

import styles from "./UnitMoveButton.module.scss";

const buttonTypes = {
  north: {
    className: styles.moveN,
    emoji: "⬆️",
    label: "North",
    dx: 0,
    dy: -5,
  },
  east: { className: styles.moveE, emoji: "➡️", label: "East", dx: 5, dy: 0 },
  south: { className: styles.moveS, emoji: "⬇️", label: "South", dx: 0, dy: 5 },
  west: { className: styles.moveW, emoji: "⬅️", label: "West", dx: -5, dy: 0 },
};
type ButtonType = keyof typeof buttonTypes;

interface Props {
  onClick(dx: number, dy: number): void;
  type: ButtonType;
}

export default function UnitMoveButton({ onClick, type }: Props) {
  const { className, emoji, label, dx, dy } = useMemo(
    () => buttonTypes[type],
    [type]
  );

  const clicked = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onClick(dx, dy);
    },
    [dx, dy, onClick]
  );

  return (
    <button
      className={`${styles.main} ${className}`}
      onClick={clicked}
      aria-label={label}
    >
      {emoji}
    </button>
  );
}
