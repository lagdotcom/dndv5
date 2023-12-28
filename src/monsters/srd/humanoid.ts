import acolyteUrl from "@img/tok/acolyte.png";
import archmageUrl from "@img/tok/archmage.png";
import assassinUrl from "@img/tok/assassin.png";
import banditUrl from "@img/tok/bandit.png";
import banditCaptainUrl from "@img/tok/bandit-captain.png";
import thugUrl from "@img/tok/thug.png";

import { ClericSpellcasting } from "../../classes/cleric";
import SneakAttack from "../../classes/rogue/SneakAttack";
import { WizardSpellcasting } from "../../classes/wizard";
import { Surprised } from "../../effects";
import Engine from "../../Engine";
import { bonusSpellsFeature } from "../../features/common";
import Evasion from "../../features/Evasion";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { CrossbowBolt } from "../../items/ammunition";
import { LeatherArmor, StuddedLeatherArmor } from "../../items/armor";
import {
  Club,
  Dagger,
  HeavyCrossbow,
  LightCrossbow,
  Mace,
  Scimitar,
  Shortsword,
} from "../../items/weapons";
import Monster from "../../Monster";
import FireBolt from "../../spells/cantrip/FireBolt";
import SacredFlame from "../../spells/cantrip/SacredFlame";
import Thaumaturgy from "../../spells/cantrip/Thaumaturgy";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import Bless from "../../spells/level1/Bless";
import CureWounds from "../../spells/level1/CureWounds";
import MageArmor from "../../spells/level1/MageArmor";
import MagicMissile from "../../spells/level1/MagicMissile";
import Sanctuary from "../../spells/level1/Sanctuary";
import MirrorImage from "../../spells/level2/MirrorImage";
import MistyStep from "../../spells/level2/MistyStep";
import LightningBolt from "../../spells/level3/LightningBolt";
import Stoneskin from "../../spells/level4/Stoneskin";
import ConeOfCold from "../../spells/level5/ConeOfCold";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import Enchantment from "../../types/Enchantment";
import Priority from "../../types/Priority";
import SizeCategory from "../../types/SizeCategory";
import { MagicResistance, PackTactics, SpellDamageResistance } from "../common";
import { makeBagMultiattack } from "../multiattack";
import Parry from "../Parry";

export class Acolyte extends Monster {
  constructor(g: Engine) {
    super(g, "acolyte", 0.25, "humanoid", SizeCategory.Medium, acolyteUrl, 9);
    this.don(new Club(g), true);
    this.movement.set("speed", 30);
    this.setAbilityScores(10, 10, 10, 10, 14, 11);
    this.addProficiency("Medicine", "proficient");
    this.addProficiency("Religion", "proficient");
    this.languages.add("Common"); // TODO any one language (usually Common)

    this.classLevels.set("Cleric", 1);
    this.addFeature(ClericSpellcasting.feature);
    this.addPreparedSpells(
      // TODO Light,
      SacredFlame,
      Thaumaturgy,
      Bless,
      CureWounds,
      Sanctuary,
    );
  }
}

const ArchmageSpellcastingMethod = new InnateSpellcasting(
  "Archmage Innate Spells",
  "int",
);
const ArchmageSpellcasting = bonusSpellsFeature(
  "Archmage Spellcasting",
  `The archmage can cast disguise self and invisibility at will.`,
  "Wizard",
  ArchmageSpellcastingMethod,
  [
    // TODO { level: 0, spell: DisguiseSelf },
    // TODO { level: 0, spell: Invisibility },
  ],
);

export class Archmage extends Monster {
  constructor(g: Engine) {
    super(g, "archmage", 12, "humanoid", SizeCategory.Medium, archmageUrl, 99);
    this.don(new Dagger(g), true);
    this.movement.set("speed", 30);
    this.setAbilityScores(10, 14, 12, 20, 15, 16);
    this.addProficiency("int", "proficient");
    this.addProficiency("wis", "proficient");
    this.addProficiency("Arcana", "expertise");
    this.addProficiency("History", "expertise");
    this.languages.add("Common"); // TODO any six languages
    this.pb = 4;

    this.addFeature(SpellDamageResistance);

    this.addFeature(MagicResistance);
    this.addFeature(ArchmageSpellcasting);
    this.classLevels.set("Wizard", 18);
    this.addFeature(WizardSpellcasting.feature);
    this.addPreparedSpells(
      FireBolt,
      // TODO Light,
      // TODO MageHand,
      // TODO Prestidigitation,
      // TODO ShockingGrasp,
      // TODO DetectMagic,
      // TODO Identify,
      MageArmor,
      MagicMissile,
      // TODO DetectThoughts,
      MirrorImage,
      MistyStep,
      // TODO Counterspell,
      // TODO Fly,
      LightningBolt,
      // TODO Banishment,
      // TODO FireShield,
      Stoneskin,
      ConeOfCold,
      // TODO Scrying,
      // TODO WallOfForce,
      // TODO GlobeOfInvulnerability,
      // TODO Teleport,
      // TODO MindBlank,
      // TODO TimeStop,
    );

    // TODO precast spells: mage armor, stoneskin, mind blank
  }
}

const Assassinate = new SimpleFeature(
  "Assassinate",
  `During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.`,
  (g, me) => {
    const hasTakenTurn = new Set<Combatant>();
    let hasEndedTurn = false;
    g.events.on("TurnStarted", ({ detail: { who } }) => hasTakenTurn.add(who));
    g.events.on("TurnEnded", ({ detail: { who } }) => {
      if (who === me) hasEndedTurn = true;
    });

    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      if (who === me && !hasEndedTurn && !hasTakenTurn.has(target))
        diceType.add("advantage", Assassinate);
    });

    g.events.on(
      "Attack",
      ({
        detail: {
          roll: {
            type: { who, target },
          },
          outcome,
        },
      }) => {
        if (who === me && target.hasEffect(Surprised) && outcome.hits)
          outcome.add("critical", Assassinate);
      },
    );
  },
);

const AssassinMultiattack = makeBagMultiattack(
  `The assassin makes two shortsword attacks.`,
  [{ weapon: "shortsword" }, { weapon: "shortsword" }],
);

const assassinPoison: Enchantment<"weapon"> = {
  name: "poison",
  setup(g, item) {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { attack, interrupt, who } }) => {
        if (attack?.roll.type.weapon === item) {
          const attacker = attack.roll.type.who;
          const critical = attack.outcome.result === "critical";

          interrupt.add(
            new EvaluateLater(
              who,
              assassinPoison,
              Priority.Normal,
              async () => {
                const damage = await g.rollDamage(7, {
                  size: 6,
                  attacker,
                  damageType: "poison",
                  source: assassinPoison,
                  tags: atSet(),
                  target: who,
                });

                const { damageResponse } = await g.save({
                  source: assassinPoison,
                  type: { type: "flat", dc: 15 },
                  attacker,
                  who,
                  ability: "con",
                  tags: ["poison"],
                });

                await g.damage(
                  assassinPoison,
                  "poison",
                  { attacker, critical, target: who },
                  [["poison", damage]],
                  damageResponse,
                );
              },
            ),
          );
        }
      },
    );
  },
};

export class Assassin extends Monster {
  constructor(g: Engine, wieldingCrossbow = false) {
    super(g, "assassin", 8, "humanoid", SizeCategory.Medium, assassinUrl, 78);
    this.don(new StuddedLeatherArmor(g), true);
    this.movement.set("speed", 30);
    this.setAbilityScores(11, 16, 14, 13, 11, 10);
    this.addProficiency("dex", "proficient");
    this.addProficiency("int", "proficient");
    this.addProficiency("Acrobatics", "proficient");
    this.addProficiency("Deception", "proficient");
    this.addProficiency("Perception", "proficient");
    this.addProficiency("Stealth", "expertise");
    this.damageResponses.set("poison", "resist");
    // TODO Thieves' cant plus any two languages
    this.pb = 3;

    this.addFeature(Assassinate);
    this.addFeature(Evasion);
    this.classLevels.set("Rogue", 8);
    this.addFeature(SneakAttack);

    this.addFeature(AssassinMultiattack);

    const sword = new Shortsword(g).addEnchantment(assassinPoison);
    const crossbow = new LightCrossbow(g).addEnchantment(assassinPoison);
    this.give(sword, true);
    this.give(crossbow, true);
    this.don(wieldingCrossbow ? crossbow : sword);
    this.addToInventory(new CrossbowBolt(g), 20);
  }
}

export class Bandit extends Monster {
  constructor(g: Engine, wieldingCrossbow = false) {
    super(g, "bandit", 0.125, "humanoid", SizeCategory.Medium, banditUrl, 11);
    this.don(new LeatherArmor(g), true);
    this.movement.set("speed", 30);
    this.setAbilityScores(11, 12, 12, 10, 10, 10);
    this.languages.add("Common"); // any one language (usually Common)

    const scimitar = new Scimitar(g);
    const crossbow = new LightCrossbow(g);
    this.give(scimitar, true);
    this.give(crossbow, true);
    this.don(wieldingCrossbow ? crossbow : scimitar);
    this.addToInventory(new CrossbowBolt(g), 20);
  }
}

const BanditCaptainMultiattack = makeBagMultiattack(
  `The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers.`,
  [
    { weapon: "scimitar", range: "melee" },
    { weapon: "scimitar", range: "melee" },
    { weapon: "dagger", range: "melee" },
  ],
  [
    { weapon: "dagger", range: "ranged" },
    { weapon: "dagger", range: "ranged" },
  ],
);

export class BanditCaptain extends Monster {
  constructor(g: Engine) {
    super(
      g,
      "bandit captain",
      2,
      "humanoid",
      SizeCategory.Medium,
      banditCaptainUrl,
      65,
    );
    this.don(new StuddedLeatherArmor(g), true);
    this.movement.set("speed", 30);
    this.setAbilityScores(15, 16, 14, 14, 11, 14);
    this.addProficiency("str", "proficient");
    this.addProficiency("dex", "proficient");
    this.addProficiency("wis", "proficient");
    this.addProficiency("Athletics", "proficient");
    this.addProficiency("Deception", "proficient");
    this.languages.add("Common"); // any two languages

    this.addFeature(BanditCaptainMultiattack);
    this.don(new Scimitar(g), true);

    const dagger = new Dagger(g);
    this.don(dagger, true);
    this.addToInventory(dagger, 9); // TODO ???

    this.addFeature(Parry);
  }
}

const ThugMultiattack = makeBagMultiattack(
  "The thug makes two melee attacks.",
  [{ range: "melee" }, { range: "melee" }],
);

export class Thug extends Monster {
  constructor(g: Engine, wieldingCrossbow = false) {
    super(g, "thug", 0.5, "humanoid", SizeCategory.Medium, thugUrl, 32);
    this.don(new LeatherArmor(g), true);
    this.movement.set("speed", 30);
    this.setAbilityScores(15, 11, 14, 10, 10, 11);
    this.addProficiency("Intimidation", "proficient");
    this.languages.add("Common");

    this.addFeature(PackTactics);
    this.addFeature(ThugMultiattack);

    const mace = new Mace(g);
    const crossbow = new HeavyCrossbow(g);
    this.give(mace, true);
    this.give(crossbow, true);
    this.don(wieldingCrossbow ? crossbow : mace);
    this.addToInventory(new CrossbowBolt(g), 20);
  }
}
