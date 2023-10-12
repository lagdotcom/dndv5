import BonusCollector from "../../collectors/BonusCollector";
import DiceTypeCollector from "../../collectors/DiceTypeCollector";
import ErrorCollector from "../../collectors/ErrorCollector";
import InterruptionCollector from "../../collectors/InterruptionCollector";
import type Engine from "../../Engine";
import BeforeCheckEvent from "../../events/BeforeCheckEvent";
import CheckActionEvent from "../../events/CheckActionEvent";
import TurnEndedEvent from "../../events/TurnEndedEvent";
import mockEngine from "../../tests/mockEngine";
import mockPC from "../../tests/mockPC";
import Action from "../../types/Action";
import type Combatant from "../../types/Combatant";
import { EndRageAction, RageAction, RageEffect } from "./Rage";

describe("Rage Feature", () => {
  let g: Engine;
  let me: Combatant;

  beforeEach(() => {
    g = mockEngine();
    me = mockPC(g);
  });

  it("should enter rage when RageAction is applied", async () => {
    const rageAction = new RageAction(g, me);
    await rageAction.apply();
    expect(me.hasEffect(RageEffect)).toBeTruthy();
  });

  it("should end rage when EndRageAction is applied", async () => {
    const rageAction = new RageAction(g, me);
    const endRageAction = new EndRageAction(g, me);

    await rageAction.apply();
    await endRageAction.apply();

    expect(me.hasEffect(RageEffect)).toBeFalsy();
  });

  it("should have correct bonuses while raging", async () => {
    // Assuming that your RageEffect applies bonuses to the combatant's abilities
    const rageAction = new RageAction(g, me);
    await rageAction.apply();

    // Simulate an event that triggers ability checks, e.g., Strength checks
    const checkEvent = {
      type: "BeforeCheck",
      detail: {
        who: me,
        ability: "str",
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
      },
    } as BeforeCheckEvent;

    g.events.fire(checkEvent);

    // Check if the combatant has advantage on Strength checks
    expect(checkEvent.detail.diceType.result).toBe("advantage");

    // Similarly, you can add more tests to validate other bonuses while raging
  });

  it("should not cast spells while raging", async () => {
    const rageAction = new RageAction(g, me);

    await rageAction.apply();

    // Simulate a spellcasting action
    const spellCastingAction = {
      actor: me,
      isSpell: true,
    } as Action;

    const errorCollector = new ErrorCollector();
    const add = jest.spyOn(errorCollector, "add");

    g.events.fire({
      type: "CheckAction",
      detail: {
        action: spellCastingAction,
        error: errorCollector,
        config: {},
      },
    } as CheckActionEvent);

    // Ensure that casting spells during rage results in an error
    expect(add).toHaveBeenCalledWith("cannot cast spells", expect.anything());
  });

  it("should end rage if no attacks or damage taken", async () => {
    const rageAction = new RageAction(g, me);

    await rageAction.apply();

    // Simulate the combatant's turn ending without any attacks or damage taken
    await g.resolve({
      type: "TurnEnded",
      detail: {
        who: me,
        interrupt: new InterruptionCollector(),
      },
    } as TurnEndedEvent);

    expect(me.hasEffect(RageEffect)).toBeFalsy();
  });
});
