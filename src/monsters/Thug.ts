import Engine from "../Engine";
import { LeatherArmor } from "../items/armor";
import { HeavyCrossbow, Mace } from "../items/weapons";
import Monster from "../Monster";

export default class Thug extends Monster {
  constructor(g: Engine) {
    super(
      g,
      "thug",
      0.5,
      "humanoid",
      "medium",
      "https://5e.tools/img/MM/Thug.png"
    );
    this.don(new LeatherArmor(g), true);
    this.hp = this.hpMax = 32;
    this.movement.set("speed", 30);
    this.strScore = 15;
    this.dexScore = 11;
    this.conScore = 14;
    this.intScore = 10;
    this.wisScore = 10;
    this.chaScore = 11;
    this.skills.set("Intimidation", 1);
    this.languages.add("common");
    this.pb = 2;

    // TODO Pack Tactics. The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 feet of the creature and the ally isn't incapacitated.

    // TODO Multiattack. The thug makes two melee attacks.

    this.don(new Mace(g), true);
    this.don(new HeavyCrossbow(g), true);
  }
}
