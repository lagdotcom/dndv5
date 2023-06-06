import Rogue, { ASI4, Expertise } from "../../classes/rogue";
import Scout from "../../classes/rogue/Scout";
import { weaponPlus1 } from "../../enchantments/plus";
import { vicious } from "../../enchantments/weapon";
import Engine from "../../Engine";
import Lucky from "../../feats/Lucky";
import { CrossbowBolt } from "../../items/ammunition";
import { LeatherArmor } from "../../items/armor";
import { LightCrossbow, Rapier } from "../../items/weapons";
import { BracersOfTheArbalest } from "../../items/wondrous";
import PC from "../../PC";
import { AirGenasi } from "../../races/Genasi_EEPC";
import { enchant } from "../../utils/items";
import tokenUrl from "./Aura_token.png";

export default class Aura extends PC {
  constructor(g: Engine) {
    super(g, "Aura", tokenUrl);

    this.toolProficiencies.set("dice set", 1);
    this.toolProficiencies.set("horn", 1);
    this.setAbilityScores(8, 15, 11, 14, 9, 14);
    this.setRace(AirGenasi);

    this.addSubclass(Scout);
    this.addClassLevel(Rogue);
    this.addClassLevel(Rogue);
    this.addClassLevel(Rogue);
    this.addClassLevel(Rogue);
    this.addClassLevel(Rogue);
    this.addClassLevel(Rogue);
    this.addClassLevel(Rogue);

    this.setConfig(Expertise, [
      "Acrobatics",
      "thieves' tools",
      "Stealth",
      "Investigation",
    ]);
    this.setConfig(ASI4, { type: "feat", feat: Lucky });

    this.skills.set("Acrobatics", 1);
    this.skills.set("Athletics", 1);
    this.skills.set("Deception", 1);
    this.skills.set("Investigation", 1);
    this.skills.set("Medicine", 1);
    this.skills.set("Stealth", 1);

    this.don(enchant(new LightCrossbow(g), vicious));
    this.don(new LeatherArmor(g));
    this.don(new BracersOfTheArbalest(g), true);
    this.don(new Rapier(g));
    this.inventory.add(new CrossbowBolt(g, 20));
    this.inventory.add(enchant(new CrossbowBolt(g, 15), weaponPlus1));
  }
}
