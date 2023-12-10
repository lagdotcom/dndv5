import wreathedInShadowUrl from "@img/act/wreathed-in-shadow.svg";
import tokenUrl from "@img/tok/boss/kay.png";

import { makeIcon } from "../../colours";
import Effect from "../../Effect";
import Engine from "../../Engine";
import Evasion from "../../features/Evasion";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { Arrow } from "../../items/ammunition";
import { StuddedLeatherArmor } from "../../items/armor";
import { Longbow, Spear } from "../../items/weapons";
import Monster from "../../Monster";
import { atSet } from "../../types/AttackTag";
import { MundaneDamageTypes } from "../../types/DamageType";
import SizeCategory from "../../types/SizeCategory";
import { makeMultiattack } from "../common";

const hiddenName = "Shrouded Figure";
const realName = "Kay of the Abyss";

const ScreamingInside = new SimpleFeature(
  "Screaming Inside",
  "Kay does an extra 4 (1d6) psychic damage when he hits with a weapon attack.",
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, interrupt, target, critical, map } }) => {
        if (attacker === me && attack?.pre.tags.has("weapon"))
          interrupt.add(
            new EvaluateLater(me, ScreamingInside, async () => {
              const amount = await g.rollDamage(
                1,
                {
                  source: ScreamingInside,
                  attacker,
                  target,
                  size: 6,
                  damageType: "psychic",
                  tags: atSet("magical"),
                },
                critical,
              );
              map.add("psychic", amount);
            }),
          );
      },
    );
  },
);

const WreathedInShadowEffect = new Effect(
  "Wreathed in Shadow",
  "turnStart",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
      if (target.hasEffect(WreathedInShadowEffect))
        diceType.add("disadvantage", WreathedInShadowEffect);
    });

    g.events.on("CombatantDamaged", ({ detail: { who, total, interrupt } }) => {
      if (who.hasEffect(WreathedInShadowEffect) && total >= 10)
        interrupt.add(
          new EvaluateLater(who, WreathedInShadowEffect, async () => {
            await who.removeEffect(WreathedInShadowEffect);
            who.name = realName;
          }),
        );
    });
  },
  { icon: makeIcon(wreathedInShadowUrl) },
);

const WreathedInShadow = new SimpleFeature(
  "Wreathed in Shadow",
  "Kay's appearance is hidden from view by a thick black fog that whirls about him. Only a DC 22 Perception check can reveal his identity. All attacks against him are at disadvantage. This effect is dispelled until the beginning of his next turn if he takes more than 10 damage in one hit.",
  (g, me) => {
    // TODO Only a DC 22 Perception check can reveal his identity.
    const wreathe = new EvaluateLater(me, WreathedInShadow, async () => {
      await me.addEffect(WreathedInShadowEffect, { duration: Infinity });
      me.name = hiddenName;
    });

    g.events.on("BattleStarted", ({ detail: { interrupt } }) => {
      interrupt.add(wreathe);
    });

    g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
      if (who === me && !who.hasEffect(WreathedInShadowEffect))
        interrupt.add(wreathe);
    });
  },
);

const SmoulderingRage = new SimpleFeature(
  "Smouldering Rage",
  "Kay resists bludgeoning, piercing, and slashing damage from nonmagical attacks.",
  (g, me) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, attack, response } }) => {
        if (
          who === me &&
          !attack?.pre.tags.has("magical") &&
          MundaneDamageTypes.includes(damageType)
        )
          response.add("resist", SmoulderingRage);
      },
    );
  },
);

export default class Kay extends Monster {
  constructor(g: Engine) {
    super(g, hiddenName, 6, "humanoid", SizeCategory.Medium, tokenUrl, 75);
    this.diesAtZero = false;
    this.movement.set("speed", 30);
    this.setAbilityScores(14, 18, 16, 10, 8, 14);
    this.pb = 3;

    this.saveProficiencies.add("str");
    this.saveProficiencies.add("dex");
    this.addProficiency("Athletics", "proficient");
    this.addProficiency("Stealth", "expertise");
    this.conditionImmunities.add("Frightened");
    this.languages.add("Abyssal");
    this.languages.add("Common");
    this.languages.add("Orc");

    this.addFeature(ScreamingInside);
    this.addFeature(WreathedInShadow);
    this.addFeature(
      makeMultiattack(
        "Kay attacks twice with his Spear or Longbow.",
        (me) => me.attacksSoFar.length < 2,
      ),
    );
    this.addFeature(Evasion);
    this.addFeature(SmoulderingRage);

    this.don(new StuddedLeatherArmor(g), true);
    this.don(new Longbow(g), true);
    this.don(new Spear(g, 1), true);
    this.inventory.add(new Arrow(g, Infinity));
  }
}
