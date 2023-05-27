import Wizard, { ASI4 } from "../../classes/wizard";
import Evocation from "../../classes/wizard/Evocation";
import { chaoticBurst } from "../../enchantments/weapon";
import Engine from "../../Engine";
import { Dagger, Quarterstaff } from "../../items/weapons";
import { CloakOfProtection, DragonTouchedFocus } from "../../items/wondrous";
import PC from "../../PC";
import { BronzeDragonborn } from "../../races/Dragonborn_FTD";
import AcidSplash from "../../spells/cantrip/AcidSplash";
import FireBolt from "../../spells/cantrip/FireBolt";
import MindSliver from "../../spells/cantrip/MindSliver";
import RayOfFrost from "../../spells/cantrip/RayOfFrost";
import { enchant } from "../../utils/items";
import tokenUrl from "./Beldalynn_token.png";

export default class Beldalynn extends PC {
  constructor(g: Engine) {
    super(g, "Beldalynn", tokenUrl);

    this.setAbilityScores(11, 13, 13, 15, 13, 8);
    this.setRace(BronzeDragonborn);
    this.dexScore++;
    this.conScore++;
    this.strScore++;
    this.languages.add("Draconic");

    this.addSubclass(Evocation);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);

    this.setConfig(ASI4, { type: "ability", abilities: ["int", "wis"] });

    this.skills.set("History", 1);
    this.skills.set("Perception", 1);
    this.skills.set("Arcana", 1);
    this.skills.set("Investigation", 1);

    this.don(new CloakOfProtection(g), true);
    this.don(enchant(new Quarterstaff(g), chaoticBurst), true);
    this.don(new DragonTouchedFocus(g, "Slumbering"), true);
    this.inventory.add(new Dagger(g, 1));

    // TODO
    // this.addKnownSpells(
    //   ComprehendLanguages,
    //   FindFamiliar,
    //   FloatingDisk,
    //   Identify
    // );

    this.addPreparedSpells(
      AcidSplash,
      FireBolt,
      MindSliver,
      RayOfFrost

      // IceKnife,
      // MagicMissile,
      // Shield,

      // EnlargeReduce,
      // HoldPerson,

      // Fireball,
      // IntellectFortress,
      // LeomundsTinyHut,
      // MelfsMinuteMeteors,

      // WalOfFire
    );
  }
}
