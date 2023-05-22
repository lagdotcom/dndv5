import { useCallback, useMemo } from "preact/hooks";

import Combatant from "../types/Combatant";
import CombatantState from "../types/CombatantState";
import { scale } from "./state";
import styles from "./Unit.module.scss";
import UnitMoveButton from "./UnitMoveButton";

interface Props {
  isActive: boolean;
  onClick(who: Combatant, e: MouseEvent): void;
  onMove(who: Combatant, dx: number, dy: number): void;
  state: CombatantState;
  who: Combatant;
}

export default function Unit({ isActive, onClick, onMove, state, who }: Props) {
  const containerStyle = useMemo(
    () => ({
      left: state.position.x * scale.value,
      top: state.position.y * scale.value,
      width: who.sizeInUnits * scale.value,
      height: who.sizeInUnits * scale.value,
    }),
    [scale.value, state.position.x, state.position.y, who.sizeInUnits]
  );
  const tokenStyle = useMemo(
    () => ({
      width: who.sizeInUnits * scale.value,
      height: who.sizeInUnits * scale.value,
    }),
    [scale.value, who.sizeInUnits]
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
