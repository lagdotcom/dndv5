export default interface CombatantScore {
  score: number;
  maximum: number;
  modifier: number;

  setMaximum(value: number): void;
  setScore(value: number): void;
}
