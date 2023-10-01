import Effect from "../../Effect";
import Combatant from "../../types/Combatant";
import CombatantState from "../../types/CombatantState";
import ConditionName from "../../types/ConditionName";
import Point from "../../types/Point";

export interface UnitEffect<T = unknown> {
  effect: Effect<T>;
  config: T;
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
  deathSaveFailures: number;
  deathSaveSuccesses: number;
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
    deathSaveFailures,
    deathSaveSuccesses,
    effects: effectsMap,
    conditions: conditionsSet,
  } = who;

  const effects: UnitEffect[] = [];
  for (const [effect, config] of effectsMap) {
    if (effect.quiet) continue;
    effects.push({
      name: effect.name,
      icon: effect.image,
      duration: config.duration,
      effect,
      config,
    });
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
    deathSaveFailures,
    deathSaveSuccesses,
    effects,
    conditions,
  };
}
