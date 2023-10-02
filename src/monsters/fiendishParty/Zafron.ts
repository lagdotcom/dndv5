import Engine from "../../Engine";
import { EventListener } from "../../events/Dispatcher";
import { notImplementedFeature } from "../../features/common";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import YesNoChoice from "../../interruptions/YesNoChoice";
import { ScaleMailArmor } from "../../items/armor";
import { Greataxe } from "../../items/weapons";
import { MapSquareSize } from "../../MapSquare";
import Monster from "../../Monster";
import { BoundedMove } from "../../movement";
import { WeaponItem } from "../../types/Item";
import { round } from "../../utils/numbers";
import { makeMultiattack } from "../common";
import tokenUrl from "./Zafron_token.png";

const LustForBattle = new ConfiguredFeature<WeaponItem>(
  "Lust for Battle",
  "When Zafron hits with his Greataxe, he gains 5 temporary hit points.",
  (g, me, weapon) => {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { attack, attacker, interrupt } }) => {
        if (attacker === me && attack?.pre.weapon === weapon)
          interrupt.add(
            new EvaluateLater(me, LustForBattle, async () => {
              // TODO [MESSAGE]
              await g.giveTemporaryHP(me, 5, LustForBattle);
            }),
          );
      },
    );
  },
);

// TODO
const BullRush = notImplementedFeature(
  "Bull Rush",
  "Until the beginning of his next turn, Zafron gains resistance to bludgeoning, piercing and slashing damage. Then, he moves up to his speed in a single direction. All enemies that he passes through must make a DC 15 Dexterity save or be knocked prone.",
);

const SurvivalReflex = new SimpleFeature(
  "Survival Reflex",
  "Reaction: When forced to make a skill check or saving throw, Zafron gains advantage on the roll. After the triggering action is complete, he may move up to half his speed.",
  (g, me) => {
    let activated = false;

    const useReflex: EventListener<"BeforeCheck" | "BeforeSave"> = ({
      detail: { who, interrupt, diceType },
    }) => {
      if (who === me && me.time.has("reaction"))
        interrupt.add(
          new YesNoChoice(
            me,
            SurvivalReflex,
            "Survival Reflex",
            `Use ${me.name}'s reaction to gain advantage and move half their speed?`,
            async () => {
              me.time.delete("reaction");
              activated = true;
              diceType.add("advantage", SurvivalReflex);
            },
          ),
        );
    };
    g.events.on("BeforeCheck", useReflex);
    g.events.on("BeforeSave", useReflex);

    g.events.on("AfterAction", ({ detail: { interrupt } }) => {
      if (activated) {
        activated = false;
        interrupt.add(
          new EvaluateLater(me, SurvivalReflex, async () =>
            g.applyBoundedMove(
              me,
              new BoundedMove(
                SurvivalReflex,
                round(me.speed / 2, MapSquareSize),
              ),
            ),
          ),
        );
      }
    });
  },
);

export default class Zafron extends Monster {
  constructor(g: Engine) {
    super(g, "Zafron Halehart", 5, "fiend", "medium", tokenUrl);
    this.diesAtZero = false;
    this.hp = this.hpMax = 105;
    this.movement.set("speed", 30);
    this.setAbilityScores(18, 14, 20, 7, 10, 13);
    this.pb = 3;

    this.saveProficiencies.add("str");
    this.saveProficiencies.add("con");
    this.skills.set("Acrobatics", 1);
    this.skills.set("Intimidation", 1);
    this.damageResponses.set("fire", "resist");
    this.damageResponses.set("poison", "resist");
    this.conditionImmunities.add("Poisoned");
    this.languages.add("Abyssal");

    const axe = new Greataxe(g);
    this.addFeature(LustForBattle);
    this.setConfig(LustForBattle, axe);

    this.addFeature(
      makeMultiattack(
        "Zafron attacks twice with his Greataxe.",
        (me) => me.attacksSoFar.length < 2,
      ),
    );
    this.addFeature(BullRush);
    this.addFeature(SurvivalReflex);

    this.don(new ScaleMailArmor(g), true);
    this.don(axe, true);
  }
}
