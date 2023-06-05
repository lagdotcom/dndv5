import Engine from "../Engine";
import { CrossbowBolt } from "../items/ammunition";
import { LeatherArmor } from "../items/armor";
import { HeavyCrossbow, Mace } from "../items/weapons";
import Monster from "../Monster";
import { makeMultiattack, PackTactics } from "./common";
import tokenUrl from "./Thug_token.png";

export default class Thug extends Monster {
  constructor(g: Engine) {
    super(g, "thug", 0.5, "humanoid", "medium", tokenUrl);
    this.don(new LeatherArmor(g), true);
    this.hp = this.hpMax = 32;
    this.movement.set("speed", 30);
    this.setAbilityScores(15, 11, 14, 10, 10, 11);
    this.skills.set("Intimidation", 1);
    this.languages.add("Common");
    this.pb = 2;

    this.addFeature(PackTactics);
    this.addFeature(makeMultiattack("The thug makes two melee attacks."));

    this.don(new Mace(g), true);
    this.don(new HeavyCrossbow(g), true);
    this.inventory.add(new CrossbowBolt(g, Infinity));
  }
}
