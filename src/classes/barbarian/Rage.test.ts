import BonusCollector from "../../collectors/BonusCollector";
import DiceTypeCollector from "../../collectors/DiceTypeCollector";
import ErrorCollector from "../../collectors/ErrorCollector";
import InterruptionCollector from "../../collectors/InterruptionCollector";
import ProficiencyCollector from "../../collectors/ProficiencyCollector";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import BeforeCheckEvent from "../../events/BeforeCheckEvent";
import CheckActionEvent from "../../events/CheckActionEvent";
import TurnEndedEvent from "../../events/TurnEndedEvent";
import setupBattleTest from "../../tests/setupBattleTest";
import Action from "../../types/Action";
import { chSet } from "../../types/CheckTag";
import { EndRageAction, RageAction, RageEffect } from "./Rage";

describe("Rage Feature", () => {
  it("should enter rage when RageAction is applied", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(["Hagrond", 0, 0, 10]);

    const rageAction = new RageAction(g, me);
    await rageAction.apply();

    expect(me.hasEffect(RageEffect)).toBeTruthy();
  });

  it("should end rage when EndRageAction is applied", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(["Hagrond", 0, 0, 10]);

    const rageAction = new RageAction(g, me);
    const endRageAction = new EndRageAction(g, me);

    await rageAction.apply();
    await endRageAction.apply();

    expect(me.hasEffect(RageEffect)).toBeFalsy();
  });

  it("should have correct bonuses while raging", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(["Hagrond", 0, 0, 10]);

    const rageAction = new RageAction(g, me);
    await rageAction.apply();

    const diceType = new DiceTypeCollector();
    g.events.fire(
      new BeforeCheckEvent({
        who: me,
        ability: "str",
        dc: 10,
        tags: chSet(),
        diceType,
        proficiency: new ProficiencyCollector(),
        bonus: new BonusCollector(),
        successResponse: new SuccessResponseCollector(),
        interrupt: new InterruptionCollector(),
      }),
    );

    expect(diceType.result).toBe("advantage");
  });

  it("should not cast spells while raging", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(["Hagrond", 0, 0, 10]);

    const rageAction = new RageAction(g, me);
    await rageAction.apply();

    const spellCastingAction = {
      actor: me,
      tags: new Set(["spell"]),
    } as Action;

    const errorCollector = new ErrorCollector();
    const add = jest.spyOn(errorCollector, "add");

    g.events.fire(
      new CheckActionEvent({
        action: spellCastingAction,
        error: errorCollector,
        config: {},
      }),
    );

    expect(add).toHaveBeenCalledWith("cannot cast spells", expect.anything());
  });

  it("should end rage if no attacks or damage taken", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(["Hagrond", 0, 0, 10]);

    const rageAction = new RageAction(g, me);
    await rageAction.apply();

    await g.resolve(
      new TurnEndedEvent({
        who: me,
        interrupt: new InterruptionCollector(),
      }),
    );

    expect(me.hasEffect(RageEffect)).toBeFalsy();
  });
});
