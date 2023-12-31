import iconUrl from "@img/spl/counterspell.svg";

import CastSpell, { getSpellChecker } from "../../actions/CastSpell";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import { makeIcon } from "../../colours";
import { HasTarget, Scales } from "../../configs";
import DndRule from "../../DndRule";
import { canSee } from "../../filters";
import PickFromListChoice, {
  PickChoice,
} from "../../interruptions/PickFromListChoice";
import FakeResolver from "../../resolvers/FakeResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import { chSet } from "../../types/CheckTag";
import Priority from "../../types/Priority";
import Spell from "../../types/Spell";
import { sieve } from "../../utils/array";
import { checkConfig } from "../../utils/config";
import { enumerate } from "../../utils/numbers";
import { scalingSpell } from "../common";

type Config = HasTarget & { spell: Spell; success: SuccessResponseCollector };
type CastCounterspell = CastSpell<Config & Scales>;

const CounterspellIcon = makeIcon(iconUrl);

const Counterspell = scalingSpell<Config>({
  status: "implemented",
  name: "Counterspell",
  icon: CounterspellIcon,
  level: 3,
  school: "Abjuration",
  time: "reaction",
  s: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect.

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.`,

  getConfig: (g) => ({
    target: new TargetResolver(g, 60, [canSee]),
    spell: new FakeResolver("spell"),
    success: new FakeResolver("success"),
  }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply({ g, caster: who, method }, { slot, spell, success }) {
    if (spell.level > slot) {
      const { outcome } = await g.abilityCheck(10 + spell.level, {
        who,
        ability: method.ability ?? "int",
        tags: chSet("counterspell"),
      });
      if (outcome === "fail") return;
    }

    success.add("fail", Counterspell);
  },
});
export default Counterspell;

const isCounterspell = getSpellChecker(Counterspell);
new DndRule("Counterspell", (g) => {
  g.events.on(
    "SpellCast",
    ({ detail: { who: caster, success, interrupt, spell } }) => {
      const others = Array.from(g.combatants).filter(
        (other) => other !== caster && other.hasTime("reaction"),
      );

      for (const who of others) {
        const actions: PickChoice<{
          action: CastCounterspell;
          config: Config & Scales;
        }>[] = g
          .getActions(who)
          .filter(isCounterspell)
          .flatMap((action) =>
            enumerate(
              action.method.getMinSlot?.(Counterspell, caster) ?? 3,
              action.method.getMaxSlot?.(Counterspell, caster) ?? 3,
            )
              .map((slot) => ({ slot, target: caster, success, spell }))
              .filter((config) => checkConfig(g, action, config))
              .map((config) => ({
                label: `cast Counterspell at level ${config.slot}`,
                value: { action, config },
              })),
          );

        if (actions.length)
          interrupt.add(
            new PickFromListChoice(
              who,
              Counterspell,
              "Counterspell",
              `${caster.name} is casting a spell. Should ${who.name} cast Counterspell as a reaction?`,
              Priority.ChangesOutcome,
              actions,
              async ({ action, config }) => g.act(action, config),
              true,
            ),
          );
      }
    },
  );
});
