import { MarkOptional } from "ts-essentials";

import Effect from "./Effect";
import Engine from "./Engine";
import Action from "./types/Action";
import ActionTime from "./types/ActionTime";
import Combatant from "./types/Combatant";
import CreatureType from "./types/CreatureType";
import SizeCategory from "./types/SizeCategory";
import { combinations } from "./utils/combinatorics";
import { distance } from "./utils/units";

export interface ErrorFilter<T> {
  name: string;
  message: string;
  check(g: Engine, action: Action, value: T): boolean;
}

const makeFilter = <T>({
  name,
  message = name,
  check,
}: MarkOptional<ErrorFilter<T>, "message">): ErrorFilter<T> => ({
  name,
  message,
  check,
});

export const canSee = makeFilter<Combatant>({
  name: "can see",
  message: "not visible",
  check: (g, action, value) => g.canSee(action.actor, value),
});

export const capable = makeFilter<Combatant>({
  name: "can act",
  message: "incapacitated",
  check: (g, action, value) => !value.conditions.has("Incapacitated"),
});

export const conscious = makeFilter<Combatant>({
  name: "conscious",
  message: "unconscious",
  check: (g, action, value) => !value.conditions.has("Unconscious"),
});

export const isAlly = makeFilter<Combatant>({
  name: "ally",
  message: "must target ally",
  check: (g, action, value) => action.actor.side === value.side,
});

export const isConcentrating = makeFilter<Combatant>({
  name: "concentrating",
  message: "target must be concentrating",
  check: (g, action, value) => value.concentratingOn.size > 0,
});

export const isEnemy = makeFilter<Combatant>({
  name: "enemy",
  message: "must target enemy",
  check: (g, action, value) => action.actor.side !== value.side,
});

export const notSelf = makeFilter<Combatant>({
  name: "not self",
  check: (g, action, value) => action.actor !== value,
});

export const hasEffect = (
  effect: Effect<unknown>,
  name = effect.name,
  message = "no effect",
) =>
  makeFilter<Combatant>({
    name,
    message,
    check: (g, action, value) => value.hasEffect(effect),
  });

export const hasTime = (time: ActionTime) =>
  makeFilter<Combatant>({
    name: `has ${time}`,
    message: "no time",
    check: (g, action, value) => value.hasTime(time),
  });

export const ofCreatureType = (...types: CreatureType[]) =>
  makeFilter<Combatant>({
    name: types.join("/"),
    message: "wrong creature type",
    check: (g, action, value) => types.includes(value.type),
  });

export const notOfCreatureType = (...types: CreatureType[]) =>
  makeFilter<Combatant>({
    name: `not ${types.join("/")}`,
    message: "wrong creature type",
    check: (g, action, value) => !types.includes(value.type),
  });

export const sizeOrLess = (size: SizeCategory) =>
  makeFilter<Combatant>({
    name: `up to ${SizeCategory[size]}`,
    message: "too big",
    check: (g, action, value) => value.size <= size,
  });

export const isGrappledBy = (grappler: Combatant) =>
  makeFilter<Combatant>({
    name: "grappled",
    message: `not grappled by ${grappler.name}`,
    check: (g, action, value) => grappler.grappling.has(value),
  });

export const withinRangeOfEachOther = (range: number) =>
  makeFilter<Combatant[]>({
    name: `within ${range}' of each other`,
    message: `within ${range}' of each other`,
    check: (g, action, value) =>
      !combinations(value, 2).find(([a, b]) => distance(a, b) > range),
  });
