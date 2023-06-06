export default interface CombatantScore {
  score: number;
  maximum: number;
  modifier: number;

  setScore(value: number, extendMaximum?: boolean): void;
}
