import AIRule from "../types/AIRule";
import DamageRule from "./DamageRule";
import HealingRule from "./HealingRule";

export const defaultAIRules: AIRule[] = [new HealingRule(), new DamageRule()];
