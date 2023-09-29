import Combatant from "../../types/Combatant";
import CombatantState from "../../types/CombatantState";
import Point from "../../types/Point";

export interface UnitData {
  who: Combatant;
  position: Point;

  id: number;
  name: string;
  img: string;
  sizeInUnits: number;
  attacksSoFar: number;
  movedSoFar: number;
  speed: number;

  hp: number;
  hpMax: number;
  temporaryHP: number;
}

export function getUnitData(who: Combatant, state: CombatantState): UnitData {
  const { position } = state;
  const {
    id,
    name,
    img,
    sizeInUnits,
    attacksSoFar,
    movedSoFar,
    speed,
    hp,
    hpMax,
    temporaryHP,
  } = who;

  return {
    who,
    position,
    id,
    name,
    img,
    sizeInUnits,
    attacksSoFar: attacksSoFar.length,
    movedSoFar,
    speed,
    hp,
    hpMax,
    temporaryHP,
  };
}
