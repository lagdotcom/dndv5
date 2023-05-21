import Engine from "../Engine";
import { CrossbowBolt } from "../items/ammunition";
import { LeatherArmor } from "../items/armor";
import { HeavyCrossbow, Mace } from "../items/weapons";
import Monster from "../Monster";
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

    // TODO Pack Tactics. The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 feet of the creature and the ally isn't incapacitated.

    // TODO Multiattack. The thug makes two melee attacks.

    this.don(new Mace(g), true);
    this.don(new HeavyCrossbow(g), true);
    this.inventory.add(new CrossbowBolt(g, Infinity));
  }
}
