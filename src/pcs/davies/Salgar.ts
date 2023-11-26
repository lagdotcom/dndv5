import tokenUrl from "@img/tok/pc/salgar.png";

import Druid, { ASI4 } from "../../classes/druid";
import Land, { BonusCantrip, CircleSpells } from "../../classes/druid/Land";
import WildShape from "../../classes/druid/WildShape";
import silvered from "../../enchantments/silvered";
import Engine from "../../Engine";
import { HideArmor } from "../../items/armor";
import { ArrowCatchingShield } from "../../items/shields";
import { Handaxe, Shortsword, Spear } from "../../items/weapons";
import BootsOfTheWinterlands from "../../items/wondrous/BootsOfTheWinterlands";
import CloakOfElvenkind from "../../items/wondrous/CloakOfElvenkind";
import Bat from "../../monsters/Bat";
import GiantBadger from "../../monsters/GiantBadger";
import PC from "../../PC";
import { MountainDwarf, ToolProficiency } from "../../races/Dwarf";
import MagicStone from "../../spells/cantrip/MagicStone";
import EarthTremor from "../../spells/level1/EarthTremor";
import HealingWord from "../../spells/level1/HealingWord";
import LesserRestoration from "../../spells/level2/LesserRestoration";
import Moonbeam from "../../spells/level2/Moonbeam";
import EruptingEarth from "../../spells/level3/EruptingEarth";
import CharmMonster from "../../spells/level4/CharmMonster";
import GuardianOfNature from "../../spells/level4/GuardianOfNature";
import { enchant } from "../../utils/items";

export default class Salgar extends PC {
  constructor(g: Engine) {
    super(g, "Salgar", tokenUrl);

    this.addProficiency("Arcana", "proficient");
    this.addProficiency("History", "proficient");
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

    this.setConfig(WildShape, [new Bat(g), new GiantBadger(g)]);

    this.addProficiency("Insight", "proficient");
    this.addProficiency("Survival", "proficient");

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
      Moonbeam,

      EruptingEarth,

      CharmMonster,
      GuardianOfNature,
    );
  }
}
