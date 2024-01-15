import AuraController from "../../AuraController";
import DndRule from "../../DndRule";
import SimpleFeature from "../../features/SimpleFeature";
import { Feet, PCClassLevel } from "../../flavours";
import Combatant from "../../types/Combatant";

const aurasOfProtection = new Map<Combatant, AuraController>();
new DndRule("Paladin Auras", () => aurasOfProtection.clear());

export function getAuraOfProtection(who: Combatant) {
  return aurasOfProtection.get(who);
}

function getPaladinAuraRadius(level: PCClassLevel): Feet {
  if (level < 18) return 10;
  return 30;
}

const AuraOfProtection = new SimpleFeature(
  "Aura of Protection",
  `Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.

At 18th level, the range of this aura increases to 30 feet.`,
  (g, me) => {
    const radius = getPaladinAuraRadius(me.getClassLevel("Paladin", 6));
    const aura = new AuraController(
      g,
      `Paladin Aura (${me.name})`,
      me,
      radius,
      ["holy"],
      "yellow",
    ).setActiveChecker((who) => !who.conditions.has("Unconscious"));
    aurasOfProtection.set(me, aura);

    g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
      if (who.side === me.side && aura.isAffecting(who))
        bonus.add(Math.max(1, me.cha.modifier), AuraOfProtection);
    });
  },
);
export default AuraOfProtection;
