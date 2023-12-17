import Engine from "../../../Engine";
import { DawnResource } from "../../../resources";
import Web from "../../../spells/level2/Web";
import WandBase from "../../WandBase";

export class WandOfWeb extends WandBase {
  constructor(g: Engine, charges = 7) {
    super(
      g,
      "Wand of Web",
      "Uncommon",
      charges,
      7,
      new DawnResource("charge", 7),
      Web,
      15,
    );
  }
}
