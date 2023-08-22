import WeaponAttack from "../actions/WeaponAttack";
import { OneAttackPerTurnRule } from "../DndRules";
import { notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import Action from "../types/Action";
import Combatant from "../types/Combatant";

export const KeenSmell = new SimpleFeature(
  "Keen Smell",
  `This has advantage on Wisdom (Perception) checks that rely on smell.`,
  (g, me) => {
    g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
      if (who === me && tags.has("smell")) diceType.add("advantage", KeenSmell);
    });
  },
);

export const PackTactics = notImplementedFeature(
  "Pack Tactics",
  `This has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn't incapacitated.`,
);

export function makeMultiattack(
  text: string,
  canStillAttack: (me: Combatant, action: Action) => boolean,
) {
  return new SimpleFeature("Multiattack", text, (g, me) => {
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.actor === me && action.isAttack && canStillAttack(me, action))
        error.ignore(OneAttackPerTurnRule);
    });
  });
}

export function isMeleeAttackAction(action: Action) {
  if (!action.isAttack) return false;
  if (!(action instanceof WeaponAttack)) return false;

  // TODO this isn't right for throwing...
  return action.weapon.rangeCategory === "melee";
}
