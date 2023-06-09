import { useCallback } from "preact/hooks";

import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import styles from "./Unit.module.scss";
import UnitMoveButton from "./UnitMoveButton";
import { scale } from "./utils/state";
import { UnitData } from "./utils/types";

interface Props {
  isMoving: boolean;
  onClick(who: Combatant, e: MouseEvent): void;
  onMove(who: Combatant, dir: MoveDirection): void;
  u: UnitData;
}

export default function Unit({ isMoving, onClick, onMove, u }: Props) {
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
    (dir: MoveDirection) => onMove(u.who, dir),
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
      {isMoving && (
        <>
          <UnitMoveButton disabled={disabled} onClick={moved} type="east" />
          <UnitMoveButton
            disabled={disabled}
            onClick={moved}
            type="southeast"
          />
          <UnitMoveButton disabled={disabled} onClick={moved} type="south" />
          <UnitMoveButton
            disabled={disabled}
            onClick={moved}
            type="southwest"
          />
          <UnitMoveButton disabled={disabled} onClick={moved} type="west" />
          <UnitMoveButton
            disabled={disabled}
            onClick={moved}
            type="northwest"
          />
          <UnitMoveButton disabled={disabled} onClick={moved} type="north" />
          <UnitMoveButton
            disabled={disabled}
            onClick={moved}
            type="northeast"
          />
        </>
      )}
    </div>
  );
}
