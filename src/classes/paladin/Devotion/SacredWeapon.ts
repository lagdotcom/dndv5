import AbstractAction from "../../../actions/AbstractAction";
import ErrorCollector from "../../../collectors/ErrorCollector";
import { HasWeapon } from "../../../configs";
import Effect from "../../../Effect";
import Engine from "../../../Engine";
import SimpleFeature from "../../../features/SimpleFeature";
import ChoiceResolver from "../../../resolvers/ChoiceResolver";
import Combatant from "../../../types/Combatant";
import { minutes } from "../../../utils/time";
import { ChannelDivinityResource } from "../common";

const SacredWeaponEffect = new Effect<HasWeapon>(
  "Sacred Weapon",
  "turnStart",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, bonus, weapon, tags } }) => {
      const config = who.getEffectConfig(SacredWeaponEffect);
      if (config && config.weapon === weapon) {
        bonus.add(Math.max(1, who.cha.modifier), SacredWeaponEffect);
        tags.add("magical");
      }
    });
  }
);

class SacredWeaponAction extends AbstractAction<HasWeapon> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Channel Divinity: Sacred Weapon",
      "implemented",
      {
        weapon: new ChoiceResolver(
          g,
          actor.weapons
            .filter((weapon) => weapon.category !== "natural")
            .map((value) => ({ label: value.name, value }))
        ),
      },
      { time: "action", resources: [[ChannelDivinityResource, 1]] }
    );
  }

  check(config: never, ec: ErrorCollector) {
    if (this.actor.hasEffect(SacredWeaponEffect))
      ec.add("already active", this);

    return ec;
  }

  async apply({ weapon }: HasWeapon) {
    super.apply({ weapon });
    this.actor.addEffect(SacredWeaponEffect, { duration: minutes(1), weapon });

    // TODO The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that.
    // TODO You can end this effect on your turn as part of any other action.
    // TODO If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.
  }
}

const SacredWeapon = new SimpleFeature(
  "Channel Divinity: Sacred Weapon",
  `As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.

You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new SacredWeaponAction(g, me));
    });
  }
);
export default SacredWeapon;
