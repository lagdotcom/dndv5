import AbstractAction from "../../actions/AbstractAction";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { ChallengeRating, PCClassLevel } from "../../flavours";
import Combatant from "../../types/Combatant";
import CreatureType from "../../types/CreatureType";
import { SpecifiedWithin } from "../../types/EffectArea";
import { EffectConfig } from "../../types/EffectType";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { minutes } from "../../utils/time";
import { ChannelDivinityResource } from "../common";
import { TurnedConfig, TurnedEffect } from "../turned";
import { ClericSpellcasting } from ".";

function getDestroyUndeadCR(level: PCClassLevel): ChallengeRating {
  if (level < 5) return -Infinity;
  if (level < 8) return 0.5;
  if (level < 11) return 1;
  if (level < 14) return 2;
  if (level < 17) return 3;
  return 4;
}

const getTurnUndeadArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  who,
  radius: 30,
});

export class TurnUndeadAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public affectsTypes: CreatureType[],
    public method: SpellcastingMethod,
    public destroyCR = -Infinity,
  ) {
    super(
      g,
      actor,
      "Turn Undead",
      "incomplete",
      {},
      {
        area: [getTurnUndeadArea(actor)],
        resources: [[ChannelDivinityResource, 1]],
        tags: ["harmful"],
        time: "action",
        description: `As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.

        A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
      },
    );
  }

  getAffected() {
    return this.g
      .getInside(getTurnUndeadArea(this.actor))
      .filter((who) => this.affectsTypes.includes(who.type));
  }
  getTargets() {
    return [];
  }

  async applyEffect() {
    const { g, actor: attacker, method, destroyCR: destroyCR } = this;
    const type = method.getSaveType(attacker);

    for (const who of this.getAffected()) {
      const effect = TurnedEffect;
      const config: EffectConfig<TurnedConfig> = {
        turner: attacker,
        duration: minutes(1),
      };

      const { outcome } = await g.save({
        source: this,
        type,
        attacker,
        who,
        ability: "wis",
        method,
        effect,
        config,
        tags: ["frightened"],
      });

      if (outcome === "fail") {
        if (who.cr < destroyCR && (await g.kill(who, attacker))) return;

        await who.addEffect(effect, config, attacker);
      }
    }
  }
}

const TurnUndead = new SimpleFeature(
  "Turn Undead",
  `As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
  (g, me) => {
    const destroyCr = getDestroyUndeadCR(me.getClassLevel("Cleric", 2));

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(
          new TurnUndeadAction(
            g,
            who,
            ["undead"],
            ClericSpellcasting,
            destroyCr,
          ),
        );
    });
  },
);
export default TurnUndead;
