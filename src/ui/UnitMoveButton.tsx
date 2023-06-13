import { useCallback, useMemo } from "preact/hooks";

import MoveDirection from "../types/MoveDirection";
import iconEUrl from "./icons/e.svg";
import iconNUrl from "./icons/n.svg";
import iconNEUrl from "./icons/ne.svg";
import iconNWUrl from "./icons/nw.svg";
import iconSUrl from "./icons/s.svg";
import iconSEUrl from "./icons/se.svg";
import iconSWUrl from "./icons/sw.svg";
import iconWUrl from "./icons/w.svg";
import SVGIcon from "./SVGIcon";
import styles from "./UnitMoveButton.module.scss";
import classnames from "./utils/classnames";

const makeButtonType = (className: string, iconUrl: string, label: string) => ({
  className: styles[className],
  iconUrl,
  label,
});

const buttonTypes = {
  east: makeButtonType("moveE", iconEUrl, "Move East"),
  southeast: makeButtonType("moveSE", iconSEUrl, "Move Southeast"),
  south: makeButtonType("moveS", iconSUrl, "Move South"),
  southwest: makeButtonType("moveSW", iconSWUrl, "Move Southwest"),
  west: makeButtonType("moveW", iconWUrl, "Move West"),
  northwest: makeButtonType("moveNW", iconNWUrl, "Move Northwest"),
  north: makeButtonType("moveN", iconNUrl, "Move North"),
  northeast: makeButtonType("moveNE", iconNEUrl, "Move Northeast"),
};
interface Props {
  disabled: boolean;
  onClick(dir: MoveDirection): void;
  type: MoveDirection;
}

export default function UnitMoveButton({ disabled, onClick, type }: Props) {
  const { className, iconUrl, label } = useMemo(
    () => buttonTypes[type],
    [type]
  );

  const clicked = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onClick(type);
    },
    [type, onClick]
  );

  return (
    <button
      disabled={disabled}
      className={classnames(styles.main, className)}
      onClick={clicked}
      aria-label={label}
    >
      <SVGIcon src={iconUrl} size={26} />
    </button>
  );
}
