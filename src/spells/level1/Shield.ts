import { simpleSpell } from "../common";

const Shield = simpleSpell({
  name: "Shield",
  level: 1,
  school: "Abjuration",
  time: "reaction", // TODO which you take when you are hit by an attack or targeted by the magic missile spell
  v: true,
  s: true,
  lists: ["Sorcerer", "Wizard"],

  getConfig: () => ({}),
  getTargets: (g, caster) => [caster],

  async apply(g, caster, method, config) {
    // TODO An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.
  },
});
export default Shield;
