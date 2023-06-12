import { simpleSpell } from "../common";

const Scrying = simpleSpell({
  name: "Scrying",
  level: 5,
  school: "Divination",
  time: "long",
  v: true,
  s: true,
  m: "a focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water",
  lists: ["Bard", "Cleric", "Druid", "Warlock", "Wizard"],

  getConfig: () => ({}),
  getTargets: () => [],

  async apply(g, caster, method) {
    /* TODO You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it. If a target knows you're casting this spell, it can fail the saving throw voluntarily if it wants to be observed. */
  },
});
export default Scrying;
