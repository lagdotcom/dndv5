import SimpleFeature from "../SimpleFeature";

const FightingStyleDueling = new SimpleFeature(
  "Fighting Style: Dueling",
  `When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.`,
  (g, me) => {
    g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
      // TODO [VERSATILE]
      if (
        attacker === me &&
        weapon &&
        weapon.hands === 1 &&
        me.weapons.length === 1 &&
        me.weapons[0] === weapon
      )
        bonus.add(2, FightingStyleDueling);
    });
  },
);
export default FightingStyleDueling;
