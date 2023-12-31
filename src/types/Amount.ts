import Dice from "./Dice";

export interface FlatAmount {
  type: "flat";
  amount: number;
}
export interface DiceAmount {
  type: "dice";
  amount: Dice;
}

type Amount = FlatAmount | DiceAmount;
export default Amount;
