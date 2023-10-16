import Engine from "./Engine";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import CreatureType from "./types/CreatureType";

export type ErrorFilter<T> = {
  name: string;
  message: string;
  check(g: Engine, action: Action, value: T): boolean;
};

const makeFilter = <T>({
  name,
  message = name,
  check,
}: {
  name: string;
  message?: string;
  check: ErrorFilter<T>["check"];
}): ErrorFilter<T> => ({ name, message, check });

export const canSee = makeFilter<Combatant>({
  name: "can see",
  message: "not visible",
  check: (g, action, value) => g.canSee(action.actor, value),
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
