import Paladin from "../../classes/paladin";
import Engine from "../../Engine";
import { ChainMailArmor, Shield } from "../../items/armor";
import { Morningstar } from "../../items/weapons";
import PC from "../../PC";
import {
  AbilityScoreBonus,
  HalfElf,
  LanguageChoice,
  SkillVersatility,
} from "../../races/HalfElf";

export default class Marvoril extends PC {
  constructor(g: Engine) {
    super(g, "Marvoril", "");

    this.setAbilityScores(15, 8, 13, 12, 10, 14);
    this.setRace(HalfElf);
    this.setConfig(AbilityScoreBonus, ["str", "con"]);
    this.setConfig(SkillVersatility, ["Athletics", "Persuasion"]);
    this.setConfig(LanguageChoice, "Dwarvish");
    this.skills.set("Survival", 1);
    this.skills.set("Investigation", 1);
    this.languages.add("Primordial");
    this.languages.add("Infernal");
    this.addClassLevel(Paladin);

    this.don(new ChainMailArmor(g));
    this.don(new Morningstar(g));
    this.don(new Shield(g));
  }
}
