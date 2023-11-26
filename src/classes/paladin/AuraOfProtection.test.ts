import BonusCollector from "../../collectors/BonusCollector";
import DiceTypeCollector from "../../collectors/DiceTypeCollector";
import InterruptionCollector from "../../collectors/InterruptionCollector";
import ProficiencyCollector from "../../collectors/ProficiencyCollector";
import SaveDamageResponseCollector from "../../collectors/SaveDamageResponseCollector";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import { Dying } from "../../effects";
import BeforeSaveEvent from "../../events/BeforeSaveEvent";
import Aura from "../../pcs/davies/Aura";
import Galilea from "../../pcs/davies/Galilea";
import setupBattleTest from "../../tests/setupBattleTest";
import { svSet } from "../../types/SaveTag";
import AuraOfProtection from "./AuraOfProtection";

describe("Aura of Protection", () => {
  it("provides an effect while conscious and in range", async () => {
    const {
      g,
      combatants: [who, paladin],
    } = await setupBattleTest([Aura, 35, 0, 10], [Galilea, 0, 0, 1]);

    const outOfRange = await g.resolve(
      new BeforeSaveEvent({
        who,
        dc: 10,
        diceType: new DiceTypeCollector(),
        proficiency: new ProficiencyCollector(),
        bonus: new BonusCollector(),
        successResponse: new SuccessResponseCollector(),
        saveDamageResponse: new SaveDamageResponseCollector("normal"),
        failDamageResponse: new SaveDamageResponseCollector("normal"),
        tags: svSet(),
        interrupt: new InterruptionCollector(),
      }),
    );

    expect(outOfRange.detail.bonus.isInvolved(AuraOfProtection)).toBeFalsy();

    who.position.x = 10;

    const inRange = await g.resolve(
      new BeforeSaveEvent({
        who,
        dc: 10,
        diceType: new DiceTypeCollector(),
        proficiency: new ProficiencyCollector(),
        bonus: new BonusCollector(),
        successResponse: new SuccessResponseCollector(),
        saveDamageResponse: new SaveDamageResponseCollector("normal"),
        failDamageResponse: new SaveDamageResponseCollector("normal"),
        tags: svSet(),
        interrupt: new InterruptionCollector(),
      }),
    );

    expect(inRange.detail.bonus.isInvolved(AuraOfProtection)).toBeTruthy();
    expect(outOfRange.detail.bonus.result).toBeLessThan(
      inRange.detail.bonus.result,
    );

    paladin.effects.set(Dying, { duration: Infinity });

    const unconscious = await g.resolve(
      new BeforeSaveEvent({
        who,
        dc: 10,
        diceType: new DiceTypeCollector(),
        proficiency: new ProficiencyCollector(),
        bonus: new BonusCollector(),
        successResponse: new SuccessResponseCollector(),
        saveDamageResponse: new SaveDamageResponseCollector("normal"),
        failDamageResponse: new SaveDamageResponseCollector("normal"),
        tags: svSet(),
        interrupt: new InterruptionCollector(),
      }),
    );

    expect(unconscious.detail.bonus.isInvolved(AuraOfProtection)).toBeFalsy();
  });
});
