import DiceType from "../types/DiceType";
import { SavingThrow } from "../types/RollType";
import { BeforeSaveDetail } from "./BeforeSaveEvent";
import { DiceRolledDetail } from "./DiceRolledEvent";

export interface SaveEventDetail {
  pre: BeforeSaveDetail;
  roll: DiceRolledDetail<SavingThrow>;
  diceType: DiceType;
  total: number;
  dc: number;
  outcome: "success" | "fail";
  forced: boolean;
}

export default class SaveEvent extends CustomEvent<SaveEventDetail> {
  constructor(detail: SaveEventDetail) {
    super("Save", { detail });
  }
}
