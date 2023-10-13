import AICoefficient from "../types/AICoefficient";

class Coefficient implements AICoefficient {
  constructor(
    public name: string,
    public defaultValue = 1,
  ) {}
}

export const HealSelf = new Coefficient("HealSelf");
export const HealAllies = new Coefficient("HealAllies");
export const OverHealAllies = new Coefficient("OverHealAllies", -2);
