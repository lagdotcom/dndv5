import badgerUrl from "@img/tok/badger.png";
import batUrl from "@img/tok/bat.png";
import giantBadgerUrl from "@img/tok/giant-badger.png";

import MonsterTemplate from "../../data/MonsterTemplate";
import { notImplementedFeature } from "../../features/common";
import SizeCategory from "../../types/SizeCategory";
import { _dd, _fd } from "../../utils/dice";
import { KeenHearing, KeenSmell } from "../common";
import { makeBagMultiattack } from "../multiattack";

export const Badger: MonsterTemplate = {
  name: "badger",
  tokenUrl: badgerUrl,
  cr: 0,
  type: "beast",
  size: SizeCategory.Tiny,
  hpMax: 3,
  abilities: [4, 11, 12, 2, 12, 5],
  movement: { speed: 20, burrow: 5 },
  senses: { darkvision: 30 },
  features: [KeenSmell],
  naturalWeapons: [{ name: "bite", toHit: "dex", damage: _fd(1, "piercing") }],
};

// TODO
const Echolocation = notImplementedFeature(
  "Echolocation",
  `The bat can't use its blindsight while deafened.`,
);

export const Bat: MonsterTemplate = {
  name: "bat",
  tokenUrl: batUrl,
  cr: 0,
  type: "beast",
  size: SizeCategory.Tiny,
  hpMax: 1,
  abilities: [2, 15, 8, 2, 12, 4],
  movement: { speed: 5, fly: 30 },
  senses: { blindsight: 60 },
  features: [Echolocation, KeenHearing],
  naturalWeapons: [{ name: "bite", toHit: 0, damage: _fd(1, "piercing") }],
};

const GiantBadgerMultiattack = makeBagMultiattack(
  "The badger makes two attacks: one with its bite and one with its claws.",
  [{ weapon: "bite" }, { weapon: "claws" }],
);

export const GiantBadger: MonsterTemplate = {
  name: "giant badger",
  tokenUrl: giantBadgerUrl,
  cr: 0.25,
  type: "beast",
  hpMax: 13,
  abilities: [13, 10, 15, 2, 12, 5],
  movement: { burrow: 10 },
  senses: { darkvision: 30 },
  features: [KeenSmell, GiantBadgerMultiattack],
  naturalWeapons: [
    { name: "bite", toHit: "str", damage: _dd(1, 6, "piercing") },
    { name: "claws", toHit: "str", damage: _dd(2, 4, "slashing") },
  ],
};
