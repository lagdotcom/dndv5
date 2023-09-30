import Combatant from "../../types/Combatant";
import CombatantState from "../../types/CombatantState";
import ConditionName from "../../types/ConditionName";
import Point from "../../types/Point";

export interface UnitEffect {
  name: string;
  icon?: string;
  duration: number;
}

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
  side: number;

  hp: number;
  hpMax: number;
  temporaryHP: number;
  effects: UnitEffect[];
  conditions: ConditionName[];
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
    side,
    hp,
    hpMax,
    temporaryHP,
    effects: effectsMap,
    conditions: conditionsSet,
  } = who;

  const effects: UnitEffect[] = [];
  for (const [k, v] of effectsMap) {
    if (k.quiet) continue;
    effects.push({ name: k.name, icon: k.image, duration: v.duration });
  }

  const conditions: ConditionName[] = [];
  for (const condition of conditionsSet) conditions.push(condition);

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
    side,
    hp,
    hpMax,
    temporaryHP,
    effects,
    conditions,
  };
}
