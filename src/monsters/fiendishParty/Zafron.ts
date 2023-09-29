import Engine from "../../Engine";
import { notImplementedFeature } from "../../features/common";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { ScaleMailArmor } from "../../items/armor";
import { Greataxe } from "../../items/weapons";
import Monster from "../../Monster";
import { WeaponItem } from "../../types/Item";
import { makeMultiattack } from "../common";
import tokenUrl from "./Zafron_token.png";

const LustForBattle = new ConfiguredFeature<WeaponItem>(
  "Lust for Battle",
  "When Zafron hits with his Greataxe, he gains 5 temporary hit points.",
  (g, me, weapon) => {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { attack, attacker, interrupt } }) => {
        if (attacker === me && attack?.pre.weapon === weapon)
          interrupt.add(
            new EvaluateLater(me, LustForBattle, async () => {
              // TODO [MESSAGE]
              await g.giveTemporaryHP(me, 5, LustForBattle);
            }),
          );
      },
    );
  },
);

// TODO
const BullRush = notImplementedFeature(
  "Bull Rush",
  "Until the beginning of his next turn, Zafron gains resistance to bludgeoning, piercing and slashing damage. Then, he moves up to his speed in a single direction. All enemies that he passes through must make a DC 15 Dexterity save or be knocked prone.",
);

// TODO
const SurvivalReflex = notImplementedFeature(
  "Survival Reflex",
  "Reaction: When forced to make a skill check or saving throw, Zafron gains advantage on the roll. After the triggering action is complete, he may move up to half his speed.",
);

export default class Zafron extends Monster {
  constructor(g: Engine) {
    super(g, "Zafron Halehart", 5, "fiend", "medium", tokenUrl);
    this.diesAtZero = false;
    this.hp = this.hpMax = 105;
    this.movement.set("speed", 30);
    this.setAbilityScores(18, 14, 20, 7, 10, 13);
    this.pb = 3;

    this.saveProficiencies.add("str");
    this.saveProficiencies.add("con");
    this.skills.set("Acrobatics", 1);
    this.skills.set("Intimidation", 1);
    this.damageResponses.set("fire", "resist");
    this.damageResponses.set("poison", "resist");
    this.conditionImmunities.add("Poisoned");
    this.languages.add("Abyssal");

    const axe = new Greataxe(g);
    this.addFeature(LustForBattle);
    this.setConfig(LustForBattle, axe);

    this.addFeature(
      makeMultiattack(
        "Zafron attacks twice with his Greataxe.",
        (me) => me.attacksSoFar.length < 2,
      ),
    );
    this.addFeature(BullRush);
    this.addFeature(SurvivalReflex);

    this.don(new ScaleMailArmor(g), true);
    this.don(axe, true);
  }
}
