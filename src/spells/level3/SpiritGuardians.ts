import AuraController from "../../AuraController";
import { HasCaster, HasTargets } from "../../configs";
import Effect from "../../Effect";
import Engine from "../../Engine";
import { canSee } from "../../filters";
import { DiceCount, SpellSlot } from "../../flavours";
import EvaluateLater from "../../interruptions/EvaluateLater";
import OncePerTurnController from "../../OncePerTurnController";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import Priority from "../../types/Priority";
import { _dd } from "../../utils/dice";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

const getSpiritGuardiansArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  who,
  radius: 15,
});

const isEvil = (who: Combatant) => who.alignGE === "Evil";

const getSpiritGuardiansDamage = (caster: Combatant, slot: SpellSlot) =>
  _dd(slot as DiceCount, 8, isEvil(caster) ? "necrotic" : "radiant");

interface Config extends HasCaster {
  aura: AuraController;
  opt: OncePerTurnController;
  slot: SpellSlot;
  immune: Set<Combatant>;
}

function* getSpiritGuardianAuras(g: Engine, who: Combatant) {
  for (const other of g.combatants) {
    const config = other.getEffectConfig(SpiritGuardiansEffect);
    if (
      config &&
      !config.immune.has(who) &&
      other !== who && // not strictly true, but...
      config.aura.isAffecting(who) &&
      config.opt.canBeAffected(who)
    )
      yield config;
  }
}

const SpiritGuardiansEffect = new Effect<Config>(
  "Spirit Guardians",
  "turnStart",
  (g) => {
    // An affected creature's speed is halved in the area...
    g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of getSpiritGuardianAuras(g, who))
        multiplier.add("half", SpiritGuardiansEffect);
    });

    // ...and when the creature enters the area for the first time on a turn...
    g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
      for (const config of getSpiritGuardianAuras(g, who)) {
        interrupt.add(getAuraDamager(who, config));
      }
    });

    // ...or starts its turn there...
    g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
      for (const config of getSpiritGuardianAuras(g, who)) {
        interrupt.add(getAuraDamager(who, config));
      }
    });

    // ...it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.
    const getAuraDamager = (
      target: Combatant,
      { opt, slot, caster: attacker, method }: Config,
    ) =>
      new EvaluateLater(
        target,
        SpiritGuardiansEffect,
        Priority.Normal,
        async () => {
          opt.affect(target);

          const {
            amount: { count, size },
            damageType,
          } = getSpiritGuardiansDamage(attacker, slot);
          const damage = await g.rollDamage(count, {
            attacker,
            damageType,
            method,
            size,
            source: SpiritGuardiansEffect,
            spell: SpiritGuardians,
            tags: atSet("magical", "spell"),
            target,
          });
          const { damageResponse } = await g.save({
            source: SpiritGuardiansEffect,
            type: method.getSaveType(attacker, SpiritGuardians, slot),
            attacker,
            who: target,
            ability: "con",
            spell: SpiritGuardians,
            method,
            tags: ["magic"],
          });
          await g.damage(
            SpiritGuardiansEffect,
            damageType,
            { attacker, spell: SpiritGuardians, method, target },
            [[damageType, damage]],
            damageResponse,
          );
        },
      );
  },
  { tags: ["magic"] },
);

const SpiritGuardians = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Spirit Guardians",
  level: 3,
  school: "Conjuration",
  concentration: true,
  v: true,
  s: true,
  m: "a holy symbol",
  lists: ["Cleric"],
  description: `You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish.

  When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.
  
  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.`,
  isHarmful: true,

  getConfig: (g) => ({
    targets: new MultiTargetResolver(g, 0, Infinity, Infinity, [canSee]),
  }),
  getTargets: () => [],
  getAffectedArea: (_g, caster) => [getSpiritGuardiansArea(caster)],
  getAffected: (g, caster, { targets }) =>
    g.getInside(getSpiritGuardiansArea(caster), targets),
  getDamage: (_g, caster, _method, { slot }) => [
    getSpiritGuardiansDamage(caster, slot ?? 3),
  ],

  async apply({ g, caster, method }, { slot, targets }) {
    const aura = new AuraController(
      g,
      "Spirit Guardians",
      caster,
      15,
      [isEvil(caster) ? "profane" : "holy"],
      isEvil(caster) ? "purple" : "yellow",
    ).setActiveChecker(
      (who) =>
        who.hasEffect(SpiritGuardiansEffect) &&
        who.isConcentratingOn(SpiritGuardians),
    );

    const duration = minutes(10);
    await caster.addEffect(SpiritGuardiansEffect, {
      aura,
      opt: new OncePerTurnController(g),
      duration,
      slot,
      caster,
      method,
      immune: new Set(targets),
    });
    await caster.concentrateOn({
      spell: SpiritGuardians,
      duration,
      async onSpellEnd() {
        await caster.removeEffect(SpiritGuardiansEffect);
        aura.destroy();
      },
    });

    aura.update();
  },
});
export default SpiritGuardians;
