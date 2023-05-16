import Dice from "./Dice";

type Amount = { type: "flat"; amount: number } | { type: "dice"; amount: Dice };
export default Amount;
