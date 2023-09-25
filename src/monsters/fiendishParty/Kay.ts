import Evasion from "../../classes/rogue/Evasion";
import Engine from "../../Engine";
import { notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { Arrow } from "../../items/ammunition";
import { StuddedLeatherArmor } from "../../items/armor";
import { Longbow, Spear } from "../../items/weapons";
import Monster from "../../Monster";
import { MundaneDamageTypes } from "../../types/DamageType";
import { makeMultiattack } from "../common";
import tokenUrl from "./Kay_token.png";

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

// TODO
const WreathedInShadow = notImplementedFeature(
  "Wreathed in Shadow",
  "Kay's appearance is hidden from view by a thick black fog that whirls about him. Only a DC 22 Perception check can reveal his identity. All attacks against him are at disadvantage. This effect is dispelled until the beginning of his next turn if he takes more than 10 damage in one hit.",
);

const SmoulderingRage = new SimpleFeature(
  "Smouldering Rage",
  "Kay resists bludgeoning, piercing, and slashing damage from nonmagical attacks.",
  (g, me) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (who === me && MundaneDamageTypes.includes(damageType))
          response.add("resist", SmoulderingRage);
      },
    );
  },
);

export default class Kay extends Monster {
  constructor(g: Engine) {
    super(g, "Kay of the Abyss", 6, "humanoid", "medium", tokenUrl);
    this.diesAtZero = false;
    this.hp = this.hpMax = 75;
    this.movement.set("speed", 30);
    this.setAbilityScores(14, 18, 16, 10, 8, 14);
    this.pb = 3;

    this.saveProficiencies.add("str");
    this.saveProficiencies.add("dex");
    this.skills.set("Athletics", 1);
    this.skills.set("Stealth", 2);
    // TODO immunities: frightened
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
