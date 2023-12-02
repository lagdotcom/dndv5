import iconEUrl from "@img/ui/e.svg";
import iconNUrl from "@img/ui/n.svg";
import iconNEUrl from "@img/ui/ne.svg";
import iconNWUrl from "@img/ui/nw.svg";
import iconSUrl from "@img/ui/s.svg";
import iconSEUrl from "@img/ui/se.svg";
import iconSWUrl from "@img/ui/sw.svg";
import iconWUrl from "@img/ui/w.svg";

import MoveDirection from "../../types/MoveDirection";
import { useCallback, useMemo } from "../lib";
import classnames from "../utils/classnames";
import { canMoveDirections } from "../utils/state";
import SVGIcon from "./SVGIcon";
import styles from "./UnitMoveButton.module.scss";

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
  onClick(dir: MoveDirection): void;
  type: MoveDirection;
}

export default function UnitMoveButton({ onClick, type }: Props) {
  const { className, iconUrl, label } = useMemo(
    () => buttonTypes[type],
    [type],
  );

  const clicked = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onClick(type);
    },
    [type, onClick],
  );

  return (
    <button
      disabled={!canMoveDirections.value.includes(type)}
      className={classnames(styles.main, className)}
      onClick={clicked}
      aria-label={label}
    >
      <SVGIcon src={iconUrl} size={26} />
    </button>
  );
}
