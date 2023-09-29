import { simpleSpell } from "../common";

const StoneShape = simpleSpell({
  name: "Stone Shape",
  level: 4,
  school: "Transmutation",
  v: true,
  s: true,
  m: "soft clay, which must be worked into roughly the desired shape of the stone object",
  lists: ["Artificer", "Cleric", "Druid", "Wizard"],

  getConfig: () => ({}),
  getTargets: () => [],

  async apply(g, caster, method, config) {
    // TODO You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall, as long as the wall is less than 5 feet thick. You could also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn't possible.
  },
});
export default StoneShape;
