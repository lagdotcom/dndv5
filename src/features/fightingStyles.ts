import YesNoChoice from "../interruptions/YesNoChoice";
import { distance } from "../utils/units";
import SimpleFeature from "./SimpleFeature";

export const FightingStyleProtection = new SimpleFeature(
  "Fighting Style: Protection",
  `When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`,
  (g, me) => {
    g.events.on(
      "BeforeAttack",
      ({ detail: { who, target, interrupt, diceType } }) => {
        // TODO creature you can see

        if (
          who !== me &&
          target !== me &&
          target.side === me.side &&
          me.time.has("reaction") &&
          me.shield &&
          distance(g, me, target) <= 5
        )
          interrupt.add(
            new YesNoChoice(
              me,
              FightingStyleProtection,
              "Fighting Style: Protection",
              `${target.name} is being attacked. Impose disadvantage?`,
              async () => {
                me.time.delete("reaction");
                diceType.add("disadvantage", FightingStyleProtection);
              }
            )
          );
      }
    );
  }
);
