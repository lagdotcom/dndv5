import ActiveEffectArea from "../../ActiveEffectArea";
import SimpleFeature from "../../features/SimpleFeature";
import { arSet } from "../../types/EffectArea";
import { distance } from "../../utils/units";
import { getPaladinAuraRadius } from "./common";

const AuraOfProtection = new SimpleFeature(
  "Aura of Protection",
  `Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.

At 18th level, the range of this aura increases to 30 feet.`,
  (g, me) => {
    const radius = getPaladinAuraRadius(me.classLevels.get("Paladin") ?? 6);

    // TODO this is stupid
    let area: ActiveEffectArea | undefined;
    const updateAura = () => {
      if (area) g.removeEffectArea(area);

      area = new ActiveEffectArea(
        `Paladin Aura (${me.name})`,
        { type: "within", radius, who: me },
        arSet("holy"),
        "yellow",
      );
      g.addEffectArea(area);
    };

    g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
      if (
        who.side === me.side &&
        !me.conditions.has("Unconscious") &&
        distance(me, who) <= radius
      )
        bonus.add(Math.max(1, me.cha.modifier), AuraOfProtection);
    });

    g.events.on("CombatantMoved", ({ detail: { who } }) => {
      if (who === me && !me.conditions.has("Unconscious")) updateAura();
    });

    g.events.on("EffectAdded", ({ detail: { who } }) => {
      if (who === me && me.conditions.has("Unconscious") && area) {
        g.removeEffectArea(area);
        area = undefined;
      }
    });
    g.events.on("EffectRemoved", ({ detail: { who } }) => {
      if (who === me && !me.conditions.has("Unconscious")) updateAura();
    });

    updateAura();
  },
);
export default AuraOfProtection;
