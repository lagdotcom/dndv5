import SimpleFeature from "../features/SimpleFeature";
import YesNoChoice from "../interruptions/YesNoChoice";
import { LongRestResource } from "../resources";
import Combatant from "../types/Combatant";

export const LuckPoint = new LongRestResource("Luck Point", 3);

function useLuckyChoice(
  who: Combatant,
  text: string,
  yes: () => Promise<void>
) {
  return new YesNoChoice(who, Lucky, "Lucky", text, yes);
}

/* TODO You have inexplicable luck that seems to kick in at just the right moment.

- You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw.
- You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.
- You regain your expended luck points when you finish a long rest. */
const Lucky = new SimpleFeature("Lucky", (g, me) => {
  me.addResource(LuckPoint);

  g.events.on("diceRolled", ({ detail }) => {
    const { type, interrupt, value } = detail;

    if (
      (type.type === "attack" ||
        type.type === "check" ||
        type.type === "save") &&
      type.who === me &&
      me.hasResource(LuckPoint)
    )
      interrupt.add(
        useLuckyChoice(
          me,
          `${me.name} got ${value} on a ${type.type} roll. Use a Luck point to re-roll?`,
          async () => {
            me.spendResource(LuckPoint);

            const nr = await g.roll({ type: "luck", who: me });
            if (nr.value > value) {
              detail.otherValues.add(value);
              detail.value = nr.value;
            } else detail.otherValues.add(nr.value);
          }
        )
      );
  });
});
export default Lucky;
