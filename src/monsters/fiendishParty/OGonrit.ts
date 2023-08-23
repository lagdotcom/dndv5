import Engine from "../../Engine";
import {
  bonusSpellsFeature,
  notImplementedFeature,
} from "../../features/common";
import { FightingStyleProtection } from "../../features/fightingStyles";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { Shield, SplintArmor } from "../../items/armor";
import { Mace } from "../../items/weapons";
import Monster from "../../Monster";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import GuidingBolt from "../../spells/level1/GuidingBolt";
import MassHealingWord from "../../spells/level3/MassHealingWord";
import { distance } from "../../utils/units";
import tokenUrl from "./OGonrit_token.png";

const FiendishMantle = new SimpleFeature(
  "Fiendish Mantle",
  "Whenever any ally within 30 ft. of O Gonrit deals damage with a weapon attack, they deal an extra 2 (1d4) necrotic damage.",
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, critical, interrupt, map } }) => {
        if (
          attacker.side === me.side &&
          attacker !== me &&
          attack?.pre.tags.has("weapon") &&
          distance(g, me, attacker) <= 30
        )
          interrupt.add(
            new EvaluateLater(attacker, FiendishMantle, async () => {
              const amount = await g.rollDamage(
                1,
                {
                  attacker,
                  source: FiendishMantle,
                  damageType: "necrotic",
                  size: 4,
                },
                critical,
              );
              map.add("necrotic", amount);
            }),
          );
      },
    );
  },
);

// TODO
const ShieldBash = notImplementedFeature(
  "Shield Bash",
  "One enemy within 5 ft. must succeed on a DC 15 Constitution save or be stunned until the end of their next turn.",
);

const SpellcastingMethod = new InnateSpellcasting(
  "Spellcasting",
  "wis",
  () => undefined,
);
const Spellcasting = bonusSpellsFeature(
  "Spellcasting",
  "O Gonrit can cast guiding bolt and mass healing word at will.",
  "level",
  SpellcastingMethod,
  [
    { level: 1, spell: GuidingBolt },
    { level: 5, spell: MassHealingWord },
  ],
);

export default class OGonrit extends Monster {
  constructor(g: Engine) {
    super(g, "O Gonrit", 5, "fiend", "medium", tokenUrl);
    this.diesAtZero = false;
    this.hp = this.hpMax = 65;
    this.movement.set("speed", 30);
    this.setAbilityScores(12, 8, 14, 10, 18, 13);
    this.pb = 3;
    this.level = 5; // for spellcasting

    this.saveProficiencies.add("wis");
    this.saveProficiencies.add("cha");
    this.skills.set("Insight", 1);
    this.skills.set("Persuasion", 1);
    // TODO resistances: fire, poison
    // TODO immunities: poisoned
    this.languages.add("Abyssal");
    this.languages.add("Common");

    this.addFeature(FiendishMantle);
    this.addFeature(ShieldBash);
    this.addFeature(Spellcasting);
    this.addFeature(FightingStyleProtection);

    this.don(new SplintArmor(g), true);
    this.don(new Shield(g), true);
    this.don(new Mace(g), true);
  }
}
