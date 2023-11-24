import SimpleFeature from "../SimpleFeature";

const FightingStyleDefense = new SimpleFeature(
  "Fighting Style: Defense",
  `While you are wearing armor, you gain a +1 bonus to AC.`,
  (g, me) => {
    g.events.on("GetAC", ({ detail: { who, bonus } }) => {
      if (who === me && me.armor) bonus.add(1, FightingStyleDefense);
    });
  },
);
export default FightingStyleDefense;
