import { useCallback } from "preact/hooks";

import Combatant from "../types/Combatant";
import styles from "./Unit.module.scss";
import UnitMoveButton from "./UnitMoveButton";
import { scale } from "./utils/state";
import { UnitData } from "./utils/types";

interface Props {
  isActive: boolean;
  onClick(who: Combatant, e: MouseEvent): void;
  onMove(who: Combatant, dx: number, dy: number): void;
  u: UnitData;
}

export default function Unit({ isActive, onClick, onMove, u }: Props) {
  const containerStyle = {
    left: u.position.x * scale.value,
    top: u.position.y * scale.value,
    width: u.sizeInUnits * scale.value,
    height: u.sizeInUnits * scale.value,
  };
  const tokenStyle = {
    width: u.sizeInUnits * scale.value,
    height: u.sizeInUnits * scale.value,
  };
  const disabled = u.movedSoFar >= u.speed;

  const clicked = useCallback(
    (e: MouseEvent) => onClick(u.who, e),
    [onClick, u]
  );

  const moved = useCallback(
    (dx: number, dy: number) => onMove(u.who, dx, dy),
    [onMove, u]
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={styles.main}
      style={containerStyle}
      title={u.name}
      onClick={clicked}
    >
      <img
        className={styles.token}
        style={tokenStyle}
        alt={u.name}
        src={u.img}
      />
      {isActive && (
        <>
          <UnitMoveButton disabled={disabled} onClick={moved} type="north" />
          <UnitMoveButton disabled={disabled} onClick={moved} type="east" />
          <UnitMoveButton disabled={disabled} onClick={moved} type="south" />
          <UnitMoveButton disabled={disabled} onClick={moved} type="west" />
        </>
      )}
    </div>
  );
}
