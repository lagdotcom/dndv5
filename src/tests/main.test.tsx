import {
  getByAltText,
  getByRole,
  queryByRole,
  screen,
  waitFor,
} from "@testing-library/preact";

import { DivineSmite } from "../classes/paladin";
import { addMonster, addPC } from "../data/templates";
import { thug } from "./monsters";
import { setupBattleTestWithReact } from "./setupBattleTest";

const dialog = (name?: string) => screen.getByRole("dialog", { name });
const main = () => screen.getByRole("main");
const log = () => screen.getByRole("list", { name: "Event Log" });

const btn = (name: string) => screen.getByRole("button", { name });
const choice = (name: string) => getByRole(dialog(), "button", { name });
const menuitem = (name: string) => screen.getByRole("menuitem", { name });
const token = (name: string) => getByAltText(main(), name);
const logMsg = (name: string) => getByRole(log(), "listitem", { name });

const queryToken = (name: string) => queryByRole(main(), name);
const queryLogMsg = (name: string) => queryByRole(log(), "listitem", { name });

it("can run a simple battle", async () => {
  const {
    g,
    user,
    combatants: [me],
  } = await setupBattleTestWithReact({
    combatants: [thug(0, 0, 12), addMonster("badger", 10, 0, undefined, 4)],
  });

  await user.click(btn("Move East"));
  await user.click(token("badger"));

  g.dice.force(19, { type: "attack", who: me });
  await user.click(menuitem("Attack (mace)"));

  expect(queryToken("badger")).not.toBeInTheDocument();
  expect(logMsg("badger dies!")).toBeVisible();
});

it("supports Fog Cloud", async () => {
  const {
    g,
    user,
    combatants: [pc, enemy],
  } = await setupBattleTestWithReact({
    combatants: [
      addPC("Tethilssethanar", 0, 0, 20),
      thug(30, 0, 10, "heavy crossbow"),
    ],
  });

  const getFogCloud = () => btn("Fog Cloud (Control Air and Water)");

  await waitFor(getFogCloud);
  await user.click(getFogCloud());
  await user.click(btn("Choose Point"));
  await user.click(token("thug"));
  await user.click(btn("Execute"));
  expect(logMsg("Tethilssethanar casts Fog Cloud.")).toBeVisible();
  await user.click(btn("End Turn"));

  // area counts as heavily obscured, so attack has disadvantage from being blinded
  await user.click(token("Tethilssethanar"));
  g.dice.force(19, { type: "attack", who: enemy });
  g.dice.force(5, { type: "attack", who: enemy });
  await user.click(menuitem("Attack (heavy crossbow, crossbow bolt)"));
  expect(
    logMsg(
      "thug misses Tethilssethanar at disadvantage with heavy crossbow, firing crossbow bolt (7). (AC 14)",
    ),
  ).toBeVisible();
  await user.click(btn("End Turn"));

  // attacking into a heavily obscured area also counts as being blinded, so they cancel out
  await user.click(token("thug"));
  g.dice.force(5, { type: "attack", who: pc });
  await user.click(menuitem("Attack (dart, thrown)"));
  expect(
    logMsg("Tethilssethanar misses thug with dart (9). (AC 11)"),
  ).toBeVisible();
});

it("supports a typical Aura attack", async () => {
  const {
    g,
    user,
    combatants: [aura],
  } = await setupBattleTestWithReact({
    combatants: [
      addPC("Aura", 10, 10, 20),
      addPC("Tethilssethanar", 5, 0, 2),
      thug(0, 0, 1),
    ],
  });

  await user.click(token("thug"));
  g.dice.force(1, { type: "attack", who: aura });
  await user.click(menuitem("Attack (vicious light crossbow, crossbow bolt)"));

  expect(dialog("Lucky")).toBeVisible();
  g.dice.force(20, { type: "luck", who: aura });
  // 2d8 for crossbow base damage
  for (let i = 0; i < 2; i++)
    g.dice.force(1, { type: "damage", attacker: aura });
  // 8d6 for sneak attack damage
  for (let i = 0; i < 8; i++)
    g.dice.force(1, { type: "damage", attacker: aura });
  await user.click(choice("Yes"));

  expect(dialog("Sneak Attack")).toBeVisible();
  await user.click(choice("Yes"));
  expect(logMsg("thug takes 23 damage. (23 piercing)")).toBeVisible();
});

it("supports a typical Beldalynn attack", async () => {
  const {
    g,
    user,
    combatants: [beldalynn, enemy],
  } = await setupBattleTestWithReact({
    combatants: [
      addPC("Beldalynn", 0, 0, 20),
      thug(25, 0, 1),
      addPC("Tethilssethanar", 20, 0, 2),
    ],
  });

  await user.click(btn("Melf's Minute Meteors (Wizard)"));
  await user.click(btn("Add Point"));
  await user.click(token("thug"));
  await user.click(btn("Execute"));

  expect(dialog("Sculpt Spells")).toBeInTheDocument();
  await user.click(choice("Tethilssethanar"));

  g.dice.force(6, { type: "damage", attacker: beldalynn });
  g.dice.force(6, { type: "damage", attacker: beldalynn });
  g.dice.force(1, { type: "save", who: enemy });
  await user.click(choice("OK"));

  expect(logMsg("thug takes 12 damage. (12 fire)")).toBeVisible();
  expect(
    queryLogMsg("Tethilssethanar takes 12 damage. (12 fire)"),
  ).not.toBeInTheDocument();
});

it("supports a typical Galilea attack", async () => {
  const {
    g,
    user,
    combatants: [galilea],
  } = await setupBattleTestWithReact({
    combatants: [addPC("Galilea", 0, 0, 20), thug(5, 0, 10)],
  });

  await user.click(token("thug"));

  g.dice.force(10, { type: "attack", who: galilea });
  g.dice.force(1, { type: "damage", attacker: galilea });
  await user.click(menuitem("Attack (longsword)"));
  expect(dialog("Divine Smite")).toBeInTheDocument();

  g.dice.force(1, { type: "damage", attacker: galilea, source: DivineSmite });
  g.dice.force(1, { type: "damage", attacker: galilea, source: DivineSmite });
  await user.click(choice("1st"));

  expect(logMsg("thug takes 6 damage. (4 slashing, 2 radiant)")).toBeVisible();
});
