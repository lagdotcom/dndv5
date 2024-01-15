import Effect from "../../Effect";
import {
  CombatantID,
  Feet,
  HitPoints,
  SideID,
  Turns,
  Url,
} from "../../flavours";
import Combatant from "../../types/Combatant";
import ConditionName from "../../types/ConditionName";
import Icon from "../../types/Icon";
import Point from "../../types/Point";

export interface UnitEffect<T = unknown> {
  effect: Effect<T>;
  config: T;
  name: string;
  icon?: Icon;
  duration: Turns;
}

export interface UnitData {
  who: Combatant;
  position: Point;

  id: CombatantID;
  name: string;
  img: Url;
  sizeInUnits: Feet;
  attacksSoFar: number;
  movedSoFar: Feet;
  speed: Feet;
  side: SideID;

  hp: HitPoints;
  hpMax: HitPoints;
  temporaryHP: HitPoints;
  effects: UnitEffect[];
  conditions: ConditionName[];
  deathSaveFailures: number;
  deathSaveSuccesses: number;
}

export function getUnitData(who: Combatant): UnitData {
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
      icon: effect.icon,
      duration: config.duration,
      effect,
      config,
    });
  }

  const conditions: ConditionName[] = [];
  for (const condition of conditionsSet) conditions.push(condition);

  return {
    who,
    position: who.position,
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
