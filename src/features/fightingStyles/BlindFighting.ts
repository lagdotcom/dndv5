import SimpleFeature from "../SimpleFeature";

const FightingStyleBlindFighting = new SimpleFeature(
  "Blind Fighting",
  `You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature within that range, unless the creature successfully hides from you.`,
  (g, me) => {
    me.senses.set("blindsight", 10);
  },
);
export default FightingStyleBlindFighting;
