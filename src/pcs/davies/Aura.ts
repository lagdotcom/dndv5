import tokenUrl from "@img/tok/pc/aura.png";

import Criminal from "../../backgrounds/Criminal";
import Rogue, { ASI4, Expertise } from "../../classes/rogue";
import Scout from "../../classes/rogue/Scout";
import { weaponPlus1 } from "../../enchantments/plus";
import { vicious } from "../../enchantments/weapon";
import Engine from "../../Engine";
import Lucky from "../../feats/Lucky";
import { BoonOfVassetri } from "../../features/boons";
import { CrossbowBolt } from "../../items/ammunition";
import { LeatherArmor } from "../../items/armor";
import { LightCrossbow, Rapier } from "../../items/weapons";
import BracersOfTheArbalest from "../../items/wondrous/BracersOfTheArbalest";
import PC from "../../PC";
import { AirGenasi } from "../../races/Genasi_EEPC";
import { enchant } from "../../utils/items";

export default class Aura extends PC {
  constructor(g: Engine) {
    super(g, "Aura", tokenUrl);

    this.addProficiency("dice set", "proficient");
    this.addProficiency("horn", "proficient");
    this.setAbilityScores(8, 15, 11, 14, 9, 14);
    this.setRace(AirGenasi);

    this.setBackground(Criminal);
    this.addProficiency("Medicine", "proficient");
    this.addProficiency("Athletics", "proficient");
    this.addProficiency("dice set", "proficient");
    this.addProficiency("horn", "proficient");

    this.addClassLevel(Rogue);
    this.addProficiency("Acrobatics", "proficient");
    this.addProficiency("Deception", "proficient");
    this.addProficiency("Investigation", "proficient");
    this.addProficiency("Stealth", "proficient");

    this.addClassLevel(Rogue);
    this.addSubclass(Scout);
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
    this.addFeature(BoonOfVassetri);

    this.don(enchant(new LightCrossbow(g), vicious));
    this.don(new LeatherArmor(g));
    this.don(new BracersOfTheArbalest(g), true);
    this.don(new Rapier(g));
    this.inventory.add(new CrossbowBolt(g, 20));
    this.inventory.add(enchant(new CrossbowBolt(g, 15), weaponPlus1));
  }
}
