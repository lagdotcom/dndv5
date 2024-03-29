import { HasTarget } from "../../configs";
import { isAlly } from "../../filters";
import { simpleSpell } from "../common";
import { targetsByTouch } from "../helpers";

const SpiderClimb = simpleSpell<HasTarget>({
  name: "Spider Climb",
  level: 2,
  school: "Transmutation",
  concentration: true,
  v: true,
  s: true,
  m: "a drop of bitumen and a spider",
  lists: ["Artificer", "Sorcerer", "Warlock", "Wizard"],
  description: `Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.`,

  ...targetsByTouch([isAlly]),

  async apply() {
    // TODO [TERRAIN]
  },
});
export default SpiderClimb;
