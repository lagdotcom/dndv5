import AICoefficient from "../types/AICoefficient";

const makeAICo = (name: string, defaultValue = 1): AICoefficient => ({
  name,
  defaultValue,
});

export const HealSelf = makeAICo("HealSelf");
export const HealAllies = makeAICo("HealAllies");
export const OverHealAllies = makeAICo("OverHealAllies", -0.5);

export const DamageEnemies = makeAICo("DamageEnemies");
export const OverKillEnemies = makeAICo("OverKillEnemies", -0.25);
export const DamageAllies = makeAICo("DamageAllies", -1);
