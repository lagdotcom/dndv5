import DamageResponse from "./DamageResponse";

export default interface DamageBreakdown {
  response: DamageResponse;
  raw: number;
  amount: number;
}
