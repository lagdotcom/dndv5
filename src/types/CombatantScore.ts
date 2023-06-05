export default interface CombatantScore {
  score: number;
  maximum: number;
  bonus: number;

  setScore(value: number, extendMaximum?: boolean): void;
}
