import { useCallback } from "preact/hooks";

import Combatant from "../types/Combatant";
import Point from "../types/Point";
import { scale } from "./state";
import styles from "./Unit.module.scss";
import UnitMoveButton from "./UnitMoveButton";

interface Props {
  isActive: boolean;
  onClick(who: Combatant, e: MouseEvent): void;
  onMove(who: Combatant, dx: number, dy: number): void;
  position: Point;
  who: Combatant;
}

export default function Unit({
  isActive,
  onClick,
  onMove,
  position,
  who,
}: Props) {
  const containerStyle = {
    left: position.x * scale.value,
    top: position.y * scale.value,
    width: who.sizeInUnits * scale.value,
    height: who.sizeInUnits * scale.value,
  };
  const tokenStyle = {
    width: who.sizeInUnits * scale.value,
    height: who.sizeInUnits * scale.value,
  };

  const clicked = useCallback(
    (e: MouseEvent) => onClick(who, e),
    [onClick, who]
  );

  const moved = useCallback(
    (dx: number, dy: number) => onMove(who, dx, dy),
    [onMove, who]
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={styles.main}
      style={containerStyle}
      title={who.name}
      onClick={clicked}
    >
      <img
        className={styles.token}
        style={tokenStyle}
        alt={who.name}
        src={who.img}
      />
      {isActive && (
        <>
          <UnitMoveButton onClick={moved} type="north" />
          <UnitMoveButton onClick={moved} type="east" />
          <UnitMoveButton onClick={moved} type="south" />
          <UnitMoveButton onClick={moved} type="west" />
        </>
      )}
    </div>
  );
}
