import InterruptionCollector from "../collectors/InterruptionCollector";
import Engine from "../Engine";
import SimpleFeature from "../features/SimpleFeature";
import YesNoChoice from "../interruptions/YesNoChoice";
import { LongRestResource } from "../resources";
import Combatant from "../types/Combatant";

export const LuckPoint = new LongRestResource("Luck Point", 3);

function addLuckyOpportunity(
  g: Engine,
  who: Combatant,
  message: string,
  interrupt: InterruptionCollector,
  callback: (roll: number) => void,
) {
  interrupt.add(
    new YesNoChoice(who, Lucky, "Lucky", message, async () => {
      who.spendResource(LuckPoint);

      const nr = await g.roll({ type: "luck", who });
      callback(nr.value);
    }),
  );
}

const Lucky = new SimpleFeature(
  "Lucky",
  `You have inexplicable luck that seems to kick in at just the right moment.

- You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw.
- You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.
- You regain your expended luck points when you finish a long rest.`,
  (g, me) => {
    me.initResource(LuckPoint);

    g.events.on("DiceRolled", ({ detail }) => {
      const { type, interrupt, value } = detail;

      if (
        (type.type === "attack" ||
          type.type === "check" ||
          type.type === "save") &&
        type.who === me &&
        me.hasResource(LuckPoint)
      )
        addLuckyOpportunity(
          g,
          me,
          `${me.name} got ${value} on a ${type.type} roll. Use a Luck point to re-roll?`,
          interrupt,
          (roll) => {
            if (roll > value) {
              detail.otherValues.push(value);
              detail.value = roll;
            } else detail.otherValues.push(roll);
          },
        );

      // TODO If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.
      if (
        type.type === "attack" &&
        type.target === me &&
        me.hasResource(LuckPoint)
      )
        addLuckyOpportunity(
          g,
          me,
          `${type.who.name} got ${value} on an attack roll against ${me.name}. Use a Luck point to re-roll?`,
          interrupt,
          (roll) => {
            if (roll < value) {
              detail.otherValues.push(value);
              detail.value = roll;
            } else detail.otherValues.push(roll);
          },
        );
    });
  },
);
export default Lucky;
