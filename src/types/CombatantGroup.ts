import AICoefficient from "./AICoefficient";

export default interface CombatantGroup {
  name: string;
  getCoefficient(co: AICoefficient): number | undefined;
}
