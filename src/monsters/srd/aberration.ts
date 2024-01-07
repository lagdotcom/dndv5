import chuulUrl from "@img/tok/chuul.png";

import AbstractAttackAction from "../../actions/AbstractAttackAction";
import { HasTarget } from "../../configs";
import { Grappled } from "../../effects";
import Engine from "../../Engine";
import { Amphibious } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import { isGrappledBy } from "../../filters";
import Monster from "../../Monster";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { EffectConfig } from "../../types/EffectType";
import SaveType from "../../types/SaveType";
import SizeCategory from "../../types/SizeCategory";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { minutes } from "../../utils/time";
import { makeBagMultiattack } from "../multiattack";
import NaturalWeapon from "../NaturalWeapon";
import { CanRecover, ParalyzingPoisonEffect } from "../poisons";

class TentaclesAction extends AbstractAttackAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    public dc = 13,
  ) {
    super(
      g,
      actor,
      "Tentacles",
      "implemented",
      "tentacles",
      "melee",
      { target: new TargetResolver(g, actor.reach, [isGrappledBy(actor)]) },
      {
        description: `One creature grappled by the chuul must succeed on a DC ${dc} Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.`,
      },
    );
  }

  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }
  getAffected({ target }: HasTarget): Combatant[] {
    return [target];
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    const { g, actor, dc } = this;

    const type: SaveType = { type: "flat", dc };
    const ability = "con";
    const effect = ParalyzingPoisonEffect;
    const config: EffectConfig<CanRecover> = {
      conditions: coSet("Poisoned", "Paralyzed"),
      duration: minutes(1),
      type,
      ability,
    };

    const { outcome } = await g.save({
      source: this,
      who: target,
      type,
      ability,
      attacker: actor,
      effect,
      config,
      tags: ["poison"],
    });

    if (outcome === "fail") await target.addEffect(effect, config, actor);
  }
}

const TentaclesFeature = new SimpleFeature("Tentacles", "", (g, me) => {
  g.events.on("GetActions", ({ detail: { who, actions } }) => {
    if (who === me) actions.push(new TentaclesAction(g, me));
  });
});

export class Chuul extends Monster {
  constructor(g: Engine) {
    super(g, "chuul", 4, "aberration", SizeCategory.Large, chuulUrl, 93);
    this.alignLC = "Chaotic";
    this.alignGE = "Evil";
    this.naturalAC = 16;
    this.movement.set("swim", 30);
    this.setAbilityScores(19, 10, 16, 5, 11, 5);
    this.addProficiency("Perception", "expertise");
    this.damageResponses.set("poison", "immune");
    this.conditionImmunities.add("Poisoned");
    this.senses.set("darkvision", 60);
    this.languages.add("Deep Speech");

    this.addFeature(Amphibious);
    // TODO Sense Magic. The chuul senses magic within 120 feet of it at will. This trait otherwise works like the detect magic spell but isn't itself magical.

    const pincer = "pincer";

    this.addFeature(
      makeBagMultiattack(
        `The chuul makes two pincer attacks. If the chuul is grappling a creature, the chuul can also use its tentacles once.`,
        [{ weapon: pincer }, { weapon: pincer }, { weapon: "tentacles" }],
      ),
    );

    // Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage. The target is grappled (escape DC 14) if it is a Large or smaller creature and the chuul doesn't have two other creatures grappled.
    this.reach = 10;
    this.naturalWeapons.add(
      new NaturalWeapon(g, pincer, "str", _dd(2, 6, "bludgeoning"), {
        onHit: async (target) => {
          if (
            this.grappling.size < 2 &&
            target.size <= this.size &&
            !this.grappling.has(target)
          )
            await target.addEffect(Grappled, {
              by: this,
              duration: Infinity,
            });
        },
      }),
    );

    // Tentacles. One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.
    this.addFeature(TentaclesFeature);
  }
}
