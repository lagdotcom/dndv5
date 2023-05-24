import Rogue, { ASI4, Expertise } from "../../classes/rogue";
import Scout from "../../classes/rogue/Scout";
import Engine from "../../Engine";
import Lucky from "../../feats/Lucky";
import { CrossbowBolt } from "../../items/ammunition";
import { LeatherArmor } from "../../items/armor";
import { LightCrossbow, Rapier } from "../../items/weapons";
import PC from "../../PC";
import { AirGenasi } from "../../races/Genasi";
import tokenUrl from "./Aura_token.png";

export default class Aura extends PC {
  constructor(g: Engine) {
    super(g, "Aura", tokenUrl);

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

    const crossbow = new LightCrossbow(g);
    // TODO crossbow.addEnchantment(vicious);

    this.don(new LeatherArmor(g));
    // TODO this.don(new BracersOfTheArbalest(g));
    this.don(crossbow);
    this.don(new Rapier(g));
    this.inventory.add(new CrossbowBolt(g, 20));

    // TODO
    // const magicBolts = new CrossbowBolt(g, 15);
    // magicBolts.addEnchantment(plus1);
    // this.inventory.add(magicBolts);
  }
}
