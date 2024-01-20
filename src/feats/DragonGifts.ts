import AbstractAction from "../actions/AbstractAction";
import CastSpell from "../actions/CastSpell";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import { AttackDetail } from "../events/AttackEvent";
import ConfiguredFeature from "../features/ConfiguredFeature";
import { canSee } from "../filters";
import YesNoChoice from "../interruptions/YesNoChoice";
import MessageBuilder from "../MessageBuilder";
import TargetResolver from "../resolvers/TargetResolver";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import CureWounds from "../spells/level1/CureWounds";
import Combatant from "../types/Combatant";
import Priority from "../types/Priority";
import { sieve } from "../utils/array";
import { checkConfig } from "../utils/config";

const ProtectiveWingsResource = new LongRestResource("Protective Wings", 2);

class ProtectiveWings extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private detail?: AttackDetail,
  ) {
    super(
      g,
      actor,
      "Protective Wings",
      "implemented",
      { target: new TargetResolver(g, 5, [canSee]) },
      {
        description: `You can manifest protective wings that can shield you or others. When you or another creature you can see within 5 feet of you is hit by an attack roll, you can use your reaction to manifest spectral wings from your back for a moment. You grant a bonus to the target's AC equal to your proficiency bonus against that attack roll, potentially causing it to miss. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
        resources: [[ProtectiveWingsResource, 1]],
        time: "reaction",
      },
    );
  }

  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }
  getAffected({ target }: HasTarget) {
    return [target];
  }

  async apply(config: HasTarget) {
    await super.apply(config);

    const { g, actor, detail } = this;
    if (!detail)
      throw new Error(`ProtectiveWings.apply() without AttackDetail`);

    g.text(
      new MessageBuilder()
        .co(actor)
        .text(" uses Protective Wings on ")
        .sp()
        .co(config.target),
    );
    detail.ac += actor.pb;
  }
}

const GiftOfTheMetallicDragonResource = new LongRestResource(
  "Gift of the Metallic Dragon",
  1,
);
export const GiftOfTheMetallicDragon = new ConfiguredFeature<
  "int" | "wis" | "cha"
>(
  "Gift of the Metallic Dragon",
  `You've manifested some of the power of metallic dragons, granting you the following benefits:
- Draconic Healing. You learn the cure wounds spell. You can cast this spell without expending a spell slot. Once you cast this spell in this way, you can't do so again until you finish a long rest. You can also cast this spell using spell slots you have. The spell's spellcasting ability is Intelligence, Wisdom, or Charisma when you cast it with this feat (choose when you gain the feat).
- Protective Wings. You can manifest protective wings that can shield you or others. When you or another creature you can see within 5 feet of you is hit by an attack roll, you can use your reaction to manifest spectral wings from your back for a moment. You grant a bonus to the target's AC equal to your proficiency bonus against that attack roll, potentially causing it to miss. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
  (g, me, ability) => {
    me.initResource(GiftOfTheMetallicDragonResource);
    const giftMethod = new InnateSpellcasting(
      "Gift of the Metallic Dragon",
      ability,
      () => GiftOfTheMetallicDragonResource,
    );
    me.spellcastingMethods.add(giftMethod);
    me.preparedSpells.add(CureWounds);
    me.knownSpells.add(CureWounds);

    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (who === me)
        for (const method of me.spellcastingMethods)
          method.addCastableSpell?.(CureWounds, me);
    });

    me.initResource(ProtectiveWingsResource, me.pb);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(
          new CastSpell(g, me, giftMethod, CureWounds),
          new ProtectiveWings(g, me),
        );
    });

    g.events.on("Attack", ({ detail }) => {
      const { target, who } = detail.pre;
      const action = new ProtectiveWings(g, me, detail);

      if (checkConfig(g, action, { target }))
        detail.interrupt.add(
          new YesNoChoice(
            me,
            GiftOfTheMetallicDragon,
            "Protective Wings",
            `${who.name} hit ${target.name} with an attack. Use Protective Wings to grant +${me.pb} AC?`,
            Priority.Late,
            () => action.apply({ target }),
            undefined,
            () => detail.outcome.hits,
          ),
        );
    });
  },
);
