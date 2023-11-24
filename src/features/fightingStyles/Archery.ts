import SimpleFeature from "../SimpleFeature";

const FightingStyleArchery = new SimpleFeature(
  "Fighting Style: Archery",
  `You gain a +2 bonus to attack rolls you make with ranged weapons.`,
  (g, me) => {
    g.events.on("BeforeAttack", ({ detail: { who, weapon, bonus } }) => {
      if (who === me && weapon?.rangeCategory === "ranged")
        bonus.add(2, FightingStyleArchery);
    });
  },
);
export default FightingStyleArchery;
