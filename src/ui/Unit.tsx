import { useCallback, useMemo } from "preact/hooks";

import Combatant from "../types/Combatant";
import CombatantState from "../types/CombatantState";
import styles from "./Unit.module.scss";
import UnitMoveButton from "./UnitMoveButton";

interface Props {
  isActive: boolean;
  onClick(who: Combatant, e: MouseEvent): void;
  onMove(who: Combatant, dx: number, dy: number): void;
  scale: number;
  state: CombatantState;
  who: Combatant;
}

export default function Unit({
  isActive,
  onClick,
  onMove,
  scale,
  state,
  who,
}: Props) {
  const containerStyle = useMemo(
    () => ({
      left: state.position.x * scale,
      top: state.position.y * scale,
      width: who.sizeInUnits * scale,
      height: who.sizeInUnits * scale,
    }),
    [scale, state.position.x, state.position.y, who.sizeInUnits]
  );
  const tokenStyle = useMemo(
    () => ({
      width: who.sizeInUnits * scale,
      height: who.sizeInUnits * scale,
    }),
    [scale, who.sizeInUnits]
  );

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
    <div className={styles.main} style={containerStyle} onClick={clicked}>
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
