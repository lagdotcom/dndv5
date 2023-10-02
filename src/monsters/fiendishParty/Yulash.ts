import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import {
  bonusSpellsFeature,
  notImplementedFeature,
} from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import { LeatherArmor } from "../../items/armor";
import { Rapier } from "../../items/weapons";
import Monster from "../../Monster";
import TargetResolver from "../../resolvers/TargetResolver";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import HealingWord from "../../spells/level1/HealingWord";
import Combatant from "../../types/Combatant";
import { svSet } from "../../types/SaveTag";
import { getSaveDC } from "../../utils/dnd";
// import MistyStepSpell from "../../spells/level2/MistyStep";
import tokenUrl from "./Yulash_token.png";

// TODO
const Cheer = notImplementedFeature(
  "Cheer",
  "One ally within 30 ft. may make a melee attack against an enemy in range.",
);

// TODO
const Discord = notImplementedFeature(
  "Discord",
  "One enemy within 30 ft. must make a DC 15 Charisma save or use its reaction to make one melee attack against an ally in range.",
);

class IrritationAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Irritation",
      "implemented",
      { target: new TargetResolver(g, 30) },
      { time: "action" },
    );
  }

  check({ target }: Partial<HasTarget>, ec: ErrorCollector) {
    super.check({ target }, ec);

    if (target && target.concentratingOn.size < 1)
      ec.add("Target is not concentrating", this);

    return ec;
  }

  async apply({ target }: HasTarget) {
    super.apply({ target });

    const { g, actor } = this;
    const dc = getSaveDC(actor, "cha");
    const result = await g.savingThrow(dc, {
      ability: "con",
      attacker: actor,
      tags: svSet("concentration"),
      who: target,
    });

    if (result.outcome === "fail") await target.endConcentration();
  }
}
const Irritation = new SimpleFeature(
  "Irritation",
  "One enemy within 30ft. must make a DC 15 Constitution check or lose concentration.",
  (g, me) => {
    g.events.on("GetActions", ({ detail: { actions, who } }) => {
      if (who === me) actions.push(new IrritationAction(g, who));
    });
  },
);

const SpellcastingMethod = new InnateSpellcasting(
  "Spellcasting",
  "cha",
  () => undefined,
);
const Spellcasting = bonusSpellsFeature(
  "Spellcasting",
  "Yulash can cast healing word at will.",
  "level",
  SpellcastingMethod,
  [{ level: 1, spell: HealingWord }],
);

// TODO [PICKPOINT] [REALREACTION]
const DancingStep = notImplementedFeature(
  "Dancing Step",
  "Reaction: When an enemy moves within 5 ft., Yulash teleports to a spot within 20 ft. that she can see.",
);

export default class Yulash extends Monster {
  constructor(g: Engine) {
    super(g, "Yulash", 5, "monstrosity", "medium", tokenUrl);
    this.diesAtZero = false;
    this.hp = this.hpMax = 65;
    this.movement.set("speed", 30);
    this.setAbilityScores(8, 16, 14, 12, 13, 18);
    this.pb = 3;
    this.level = 5; // for spellcasting

    this.saveProficiencies.add("dex");
    this.saveProficiencies.add("cha");
    this.skills.set("Deception", 1);
    this.skills.set("Perception", 1);
    this.damageResponses.set("poison", "immune");
    this.conditionImmunities.add("Poisoned");
    this.languages.add("Abyssal");
    this.languages.add("Common");

    this.addFeature(Cheer);
    this.addFeature(Discord);
    this.addFeature(Irritation);
    this.addFeature(Spellcasting);
    this.addFeature(DancingStep);

    this.don(new LeatherArmor(g), true);
    this.don(new Rapier(g), true);
  }
}
