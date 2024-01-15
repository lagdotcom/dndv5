import { Modifier, Score } from "../flavours";

export default interface CombatantScore {
  score: Score;
  maximum: Score;
  minimum: Score;
  modifier: Modifier;
}
