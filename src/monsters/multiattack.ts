import AbstractAttackAction from "../actions/AbstractAttackAction";
import { TwoWeaponAttack } from "../actions/TwoWeaponAttack";
import { OneAttackPerTurnRule } from "../DndRules";
import SimpleFeature from "../features/SimpleFeature";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import RangeCategory from "../types/RangeCategory";
import { matches } from "../utils/objects";

interface AttackSpec {
  weapon: string;
  range: RangeCategory;
}

type AttackMatcher = Partial<AttackSpec>;

function getAttackSpec(action: Action): AttackSpec {
  if (!(action instanceof AbstractAttackAction))
    throw new Error(`getAttackSpec(${action.name})`);

  return { weapon: action.weaponName, range: action.rangeCategory };
}

function containsAllSpecs(
  matchers: AttackMatcher[],
  specs: AttackSpec[],
): boolean {
  const bag = matchers.slice();
  for (const spec of specs) {
    const index = bag.findIndex((match) => matches(spec, match));
    if (index < 0) return false;

    bag.splice(index, 1);
  }

  return true;
}

export function makeBagMultiattack(
  text: string,
  ...matchersList: AttackMatcher[][]
) {
  return makeMultiattack(text, (me, action) => {
    const specs = me.attacksSoFar.concat(action).map(getAttackSpec);
    return !!matchersList.find((matchers) => containsAllSpecs(matchers, specs));
  });
}

export function makeMultiattack(
  text: string,
  canStillAttack: (me: Combatant, action: Action) => boolean,
) {
  const feature = new SimpleFeature("Multiattack", text, (g, me) => {
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.actor === me) {
        if (action.tags.has("costs attack") && canStillAttack(me, action))
          error.ignore(OneAttackPerTurnRule);

        if (action instanceof TwoWeaponAttack)
          error.add("use Multiattack", feature);
      }
    });
  });

  return feature;
}
