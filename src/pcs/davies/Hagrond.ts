import Barbarian, { ASI4, PrimalKnowledge } from "../../classes/barbarian";
import Berserker from "../../classes/barbarian/Berserker";
import darkSun from "../../enchantments/darkSun";
import Engine from "../../Engine";
import { Dagger, Handaxe, Spear } from "../../items/weapons";
import PC from "../../PC";
import { StoutHalfling } from "../../races/Halfling";
import { enchant } from "../../utils/items";
import tokenUrl from "./Hagrond_token.png";

export default class Hagrond extends PC {
  constructor(g: Engine) {
    super(g, "Hagrond", tokenUrl);

    this.skills.set("Survival", 1);
    this.skills.set("Sleight of Hand", 1);
    this.toolProficiencies.set("vehicles (land)", 1);
    this.toolProficiencies.set("woodcarver's tools", 1);
    this.setAbilityScores(15, 15, 13, 10, 8, 10);
    this.setRace(StoutHalfling);

    this.addSubclass(Berserker);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);

    this.setConfig(ASI4, { type: "ability", abilities: ["str", "con"] });
    this.setConfig(PrimalKnowledge, ["Perception"]);

    this.skills.set("Intimidation", 1);
    this.skills.set("Animal Handling", 1);

    this.don(enchant(new Spear(g, 1), darkSun), true);
    // TODO this.don(new TridentOfTheDeep(g), true);
    this.inventory.add(new Dagger(g, 4));
    this.inventory.add(new Handaxe(g, 1));
    this.inventory.add(new Spear(g, 1));
    // TODO this.inventory.add(new PotionOfHillGiantStrength(g));
  }
}
