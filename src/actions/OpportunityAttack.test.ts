import ErrorCollector from "../collectors/ErrorCollector";
import { addMonster } from "../data/templates";
import { Shortbow } from "../items/weapons";
import { thug } from "../tests/monsters";
import setupBattleTest from "../tests/setupBattleTest";
import OpportunityAttack from "./OpportunityAttack";

describe("OpportunityAttack", () => {
  it("won't let you use a ranged weapon", async () => {
    const {
      g,
      combatants: [me, target],
    } = await setupBattleTest({
      combatants: [thug(0, 0, 10), addMonster("badger", 5, 0, undefined, 0)],
    });

    const bow = new Shortbow(g);
    const oa = new OpportunityAttack(g, me, bow);

    const ec = oa.check({ target }, new ErrorCollector());
    expect(ec.messages).toContain(
      "can only make opportunity attacks with melee weapons (Opportunity Attack (shortbow))",
    );
  });
});
