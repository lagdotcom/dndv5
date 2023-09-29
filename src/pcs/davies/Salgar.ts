import Druid, { ASI4 } from "../../classes/druid";
import Land, { BonusCantrip, CircleSpells } from "../../classes/druid/Land";
import silvered from "../../enchantments/silvered";
import Engine from "../../Engine";
import { HideArmor } from "../../items/armor";
import CloakOfElvenkind from "../../items/CloakOfElvenkind";
import { ArrowCatchingShield } from "../../items/shields";
import { Handaxe, Shortsword, Spear } from "../../items/weapons";
import { BootsOfTheWinterlands } from "../../items/wondrous";
import PC from "../../PC";
import { MountainDwarf, ToolProficiency } from "../../races/Dwarf";
import MagicStone from "../../spells/cantrip/MagicStone";
import EarthTremor from "../../spells/level1/EarthTremor";
import HealingWord from "../../spells/level1/HealingWord";
import LesserRestoration from "../../spells/level2/LesserRestoration";
import EruptingEarth from "../../spells/level3/EruptingEarth";
import GuardianOfNature from "../../spells/level4/GuardianOfNature";
import { enchant } from "../../utils/items";
import tokenUrl from "./Salgar_token.png";

export default class Salgar extends PC {
  constructor(g: Engine) {
    super(g, "Salgar", tokenUrl);

    this.skills.set("Arcana", 1);
    this.skills.set("History", 1);
    this.setAbilityScores(10, 8, 14, 14, 15, 10);
    this.setRace(MountainDwarf);
    this.languages.add("Elvish");
    this.languages.add("Giant");

    this.addSubclass(Land);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);

    this.setConfig(ToolProficiency, "mason's tools");
    this.setConfig(CircleSpells, "mountain");
    this.setConfig(BonusCantrip, MagicStone);
    this.setConfig(ASI4, { type: "ability", abilities: ["cha", "wis"] });

    this.skills.set("Insight", 1);
    this.skills.set("Survival", 1);

    this.don(new ArrowCatchingShield(g), true);
    this.don(new BootsOfTheWinterlands(g), true);
    this.don(new CloakOfElvenkind(g), true);
    this.don(new Spear(g, 1), true);
    this.don(new HideArmor(g));
    this.inventory.add(new Handaxe(g, 1));
    this.inventory.add(enchant(new Shortsword(g), silvered));

    this.addPreparedSpells(
      // TODO Druidcraft,
      // TODO Mending,
      // TODO MoldEarth,

      // TODO DetectMagic,
      EarthTremor,
      HealingWord,
      // TODO SpeakWithAnimals,

      LesserRestoration,
      // TODO LocateObject,
      // TODO Moonbeam,

      EruptingEarth,

      // TODO CharmMonster,
      GuardianOfNature,
    );
  }
}
