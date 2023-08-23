import Engine from "../../Engine";
import { notImplementedFeature } from "../../features/common";
import { ScaleMailArmor } from "../../items/armor";
import { Greataxe } from "../../items/weapons";
import Monster from "../../Monster";
import { makeMultiattack } from "../common";
import tokenUrl from "./Zafron_token.png";

// TODO [TEMPORARYHP]
const LustForBattle = notImplementedFeature(
  "Lust for Battle",
  "When Zafron hits with his Greataxe, he gains 5 temporary hit points.",
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
    // TODO resistances: fire, poison
    // TODO immunities: poisoned
    this.languages.add("Abyssal");

    this.addFeature(LustForBattle);
    this.addFeature(
      makeMultiattack(
        "Zafron attacks twice with his Greataxe.",
        (me) => me.attacksSoFar.length < 2,
      ),
    );
    this.addFeature(BullRush);
    this.addFeature(SurvivalReflex);

    this.don(new ScaleMailArmor(g), true);
    this.don(new Greataxe(g), true);
  }
}
