import Combatant from "../../types/Combatant";
import MoveDirection from "../../types/MoveDirection";
import { useCallback } from "../lib";
import classnames from "../utils/classnames";
import {
  canDragUnits,
  scale,
  showSideHP,
  showSideUnderlay,
} from "../utils/state";
import { UnitData } from "../utils/types";
import styles from "./Unit.module.scss";
import UnitEffectIcon from "./UnitEffectIcon";
import { UnitBriefHP, UnitDetailedHP } from "./UnitHP";
import UnitMoveButton from "./UnitMoveButton";

interface Props {
  isMoving: boolean;
  onClick?: (who: Combatant, e: MouseEvent) => void;
  onMove?: (who: Combatant, dir: MoveDirection) => void;
  u: UnitData;
}

const allyBg = "rgba(0, 0, 255, 0.25)";
const enemyBg = "rgba(255, 0, 0, 0.25)";
const otherBg = "rgba(0, 255, 0, 0.25)";

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
    backgroundColor: showSideUnderlay.value
      ? u.side === 0
        ? allyBg
        : u.side === 1
          ? enemyBg
          : otherBg
      : undefined,
  };

  const clicked = useCallback(
    (e: MouseEvent) => onClick?.(u.who, e),
    [onClick, u],
  );

  const moved = useCallback(
    (dir: MoveDirection) => onMove?.(u.who, dir),
    [onMove, u],
  );

  const onDragStart = useCallback(
    (e: DragEvent) => {
      e.dataTransfer?.setData("unit/id", String(u.id));
    },
    [u.id],
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={classnames(styles.main, { [styles.moving]: isMoving })}
      style={containerStyle}
      title={u.name}
      onClick={clicked}
      draggable={canDragUnits.value}
      onDragStart={canDragUnits.value ? onDragStart : undefined}
    >
      <img
        className={styles.token}
        style={tokenStyle}
        alt={u.name}
        src={u.img}
      />
      {isMoving && (
        <>
          <UnitMoveButton onClick={moved} type="east" />
          <UnitMoveButton onClick={moved} type="southeast" />
          <UnitMoveButton onClick={moved} type="south" />
          <UnitMoveButton onClick={moved} type="southwest" />
          <UnitMoveButton onClick={moved} type="west" />
          <UnitMoveButton onClick={moved} type="northwest" />
          <UnitMoveButton onClick={moved} type="north" />
          <UnitMoveButton onClick={moved} type="northeast" />
        </>
      )}
      {showSideHP.value.includes(u.side) ? (
        <UnitDetailedHP u={u} />
      ) : (
        <UnitBriefHP u={u} />
      )}
      <div className={styles.icons}>
        {u.effects.map((effect, i) => (
          <UnitEffectIcon key={i} effect={effect} />
        ))}
      </div>
    </div>
  );
}
