import { useCallback, useMemo } from "preact/hooks";

import styles from "./UnitMoveButton.module.scss";

const makeButtonType = (
  className: keyof typeof styles,
  emoji: string,
  label: string,
  dx: number,
  dy: number
) => ({ className: styles[className], emoji, label, dx, dy });

const buttonTypes = {
  north: makeButtonType("moveN", "⬆️", "Move North", 0, -5),
  east: makeButtonType("moveE", "➡️", "Move East", 5, 0),
  south: makeButtonType("moveS", "⬇️", "Move South", 0, 5),
  west: makeButtonType("moveW", "⬅️", "Move West", -5, 0),
};
type ButtonType = keyof typeof buttonTypes;

interface Props {
  disabled: boolean;
  onClick(dx: number, dy: number): void;
  type: ButtonType;
}

export default function UnitMoveButton({ disabled, onClick, type }: Props) {
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
      disabled={disabled}
      className={`${styles.main} ${className}`}
      onClick={clicked}
      aria-label={label}
    >
      {emoji}
    </button>
  );
}
