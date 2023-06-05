import { simpleSpell } from "../common";

const Blur = simpleSpell({
  name: "Blur",
  level: 2,
  school: "Illusion",
  concentration: true,
  v: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],

  getConfig: () => ({}),

  async apply(g, caster, method) {
    // TODO Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.
  },
});
export default Blur;
