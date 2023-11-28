import tokenUrl from "@img/tok/pc/hagrond.png";

import FolkHero from "../../backgrounds/FolkHero";
import Barbarian, { ASI4, PrimalKnowledge } from "../../classes/barbarian";
import Berserker from "../../classes/barbarian/Berserker";
import darkSun from "../../enchantments/darkSun";
import ofTheDeep from "../../enchantments/ofTheDeep";
import Engine from "../../Engine";
import { PotionOfGiantStrength } from "../../items/potions";
import { Dagger, Handaxe, Spear, Trident } from "../../items/weapons";
import PC from "../../PC";
import { StoutHalfling } from "../../races/Halfling";
import { enchant } from "../../utils/items";

export default class Hagrond extends PC {
  constructor(g: Engine) {
    super(g, "Hagrond", tokenUrl);

    this.setAbilityScores(15, 15, 13, 10, 8, 10);
    this.setRace(StoutHalfling);

    this.setBackground(FolkHero);
    this.addProficiency("Sleight of Hand", "proficient");
    this.addProficiency("woodcarver's tools", "proficient");

    this.addClassLevel(Barbarian);
    this.addProficiency("Intimidation", "proficient");
    this.addProficiency("Animal Handling", "proficient");

    this.addClassLevel(Barbarian);
    this.addSubclass(Berserker);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);
    this.addClassLevel(Barbarian);

    this.setConfig(ASI4, { type: "ability", abilities: ["str", "con"] });
    this.setConfig(PrimalKnowledge, ["Perception"]);

    this.don(enchant(new Spear(g, 1), darkSun), true);
    this.don(enchant(new Trident(g, 1), ofTheDeep), true);
    this.inventory.add(new Dagger(g, 4));
    this.inventory.add(new Handaxe(g, 1));
    this.inventory.add(new Spear(g, 1));
    this.inventory.add(new PotionOfGiantStrength(g, "Hill"));
  }
}
