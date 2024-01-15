import { Modifier } from "../flavours";
import Dice from "./Dice";

export interface FlatAmount {
  type: "flat";
  amount: Modifier;
}
export interface DiceAmount {
  type: "dice";
  amount: Dice;
}

type Amount = FlatAmount | DiceAmount;
export default Amount;
