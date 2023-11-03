import BonusCollector from "../../collectors/BonusCollector";
import DiceTypeCollector from "../../collectors/DiceTypeCollector";
import InterruptionCollector from "../../collectors/InterruptionCollector";
import SaveDamageResponseCollector from "../../collectors/SaveDamageResponseCollector";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import BeforeSaveEvent from "../../events/BeforeSaveEvent";
import Aura from "../../pcs/davies/Aura";
import Galilea from "../../pcs/davies/Galilea";
import setupBattleTest from "../../tests/setupBattleTest";
import { svSet } from "../../types/SaveTag";

describe("Aura of Protection", () => {
  it("provides an effect", async () => {
    const {
      g,
      combatants: [who],
    } = await setupBattleTest([Aura, 30, 0, 10], [Galilea, 0, 0, 1]);

    const before = await g.resolve(
      new BeforeSaveEvent({
        who,
        dc: 10,
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
        successResponse: new SuccessResponseCollector(),
        saveDamageResponse: new SaveDamageResponseCollector("normal"),
        failDamageResponse: new SaveDamageResponseCollector("normal"),
        tags: svSet(),
        interrupt: new InterruptionCollector(),
      }),
    );

    who.position.x = 10;

    const after = await g.resolve(
      new BeforeSaveEvent({
        who,
        dc: 10,
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
        successResponse: new SuccessResponseCollector(),
        saveDamageResponse: new SaveDamageResponseCollector("normal"),
        failDamageResponse: new SaveDamageResponseCollector("normal"),
        tags: svSet(),
        interrupt: new InterruptionCollector(),
      }),
    );

    expect(before.detail.bonus.result).toBeLessThan(after.detail.bonus.result);
  });
});
