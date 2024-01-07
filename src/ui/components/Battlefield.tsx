import { BattleTemplateImage } from "../../data/BattleTemplate";
import { MapSquareSize } from "../../MapSquare";
import Combatant from "../../types/Combatant";
import MoveDirection from "../../types/MoveDirection";
import Point from "../../types/Point";
import { round } from "../../utils/numbers";
import usePanning from "../hooks/usePanning";
import { useCallback, useState } from "../lib";
import classnames from "../utils/classnames";
import {
  actionAreas,
  allCombatants,
  allEffects,
  canDragUnits,
  movingCombatantId,
  scale,
  teleportInfo,
} from "../utils/state";
import BackgroundImage from "./BackgroundImage";
import styles from "./Battlefield.module.scss";
import BattlefieldEffect, { AffectedSquare } from "./BattlefieldEffect";
import Unit from "./Unit";

interface Props {
  onClickBattlefield?: (pos: Point, e: MouseEvent) => void;
  onClickCombatant?: (who: Combatant, e: MouseEvent) => void;
  onDragCombatant?: (who: Combatant, p: Point) => void;
  onMoveCombatant?: (who: Combatant, dir: MoveDirection) => void;
  showHoveredTile?: boolean;
  images?: BattleTemplateImage[];
}

export default function Battlefield({
  onClickBattlefield,
  onClickCombatant,
  onDragCombatant,
  onMoveCombatant,
  showHoveredTile,
  images = [],
}: Props) {
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [hover, setHover] = useState<Point>();

  const convertCoordinate = useCallback(
    (e: MouseEvent) => {
      const x = round(
        Math.floor((e.pageX - offset.x) / scale.value),
        MapSquareSize,
      );
      const y = round(
        Math.floor((e.pageY - offset.y) / scale.value),
        MapSquareSize,
      );
      return { x, y };
    },
    [offset.x, offset.y],
  );

  const { isPanning, onMouseDown, onMouseEnter, onMouseMove, onMouseUp } =
    usePanning(
      (dx, dy) => setOffset((old) => ({ x: old.x + dx, y: old.y + dy })),
      (e) => setHover(convertCoordinate(e)),
    );
  const onMouseOut = () => setHover(undefined);

  const onClick = useCallback(
    (e: MouseEvent) => onClickBattlefield?.(convertCoordinate(e), e),
    [convertCoordinate, onClickBattlefield],
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (e: DragEvent) => {
      const p = convertCoordinate(e);
      const id = Number(e.dataTransfer?.getData("unit/id"));
      const u = allCombatants.peek()[id - 1];
      if (u) onDragCombatant?.(u.who, p);
    },
    [convertCoordinate, onDragCombatant],
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <main
      className={classnames(styles.main, { [styles.panning]: isPanning })}
      aria-label="Battlefield"
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseOut}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      onDragOver={canDragUnits.value ? onDragOver : undefined}
      onDrop={canDragUnits.value ? onDrop : undefined}
    >
      <div style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        {allCombatants.value.map((unit) => (
          <Unit
            key={unit.id}
            isMoving={movingCombatantId.value === unit.id}
            u={unit}
            onClick={onClickCombatant}
            onMove={onMoveCombatant}
          />
        ))}
        {allEffects.value.map((effect) => (
          <BattlefieldEffect key={effect.id} {...effect} />
        ))}
        {(actionAreas.value ?? []).map((shape, i) => (
          <BattlefieldEffect key={`temp${i}`} shape={shape} top={true} />
        ))}
        {teleportInfo.value && (
          <BattlefieldEffect
            key="teleport"
            shape={teleportInfo.value}
            top={true}
            name="Teleport"
          />
        )}
        {showHoveredTile && hover && (
          <AffectedSquare point={hover} tint="silver" />
        )}
        {images.map((img, i) => (
          <BackgroundImage key={i} {...img} />
        ))}
      </div>
    </main>
  );
}
