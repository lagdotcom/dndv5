import CastSpell from "../actions/CastSpell";
import { notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import Levitate from "../spells/level2/Levitate";
import PCRace from "../types/PCRace";

const Genasi: PCRace = {
  name: "Genasi",
  size: "medium",
  abilities: new Map([["con", 2]]),
  movement: new Map([["speed", 30]]),
  languages: new Set(["Common", "Primordial"]),
  features: new Set(),
};

// TODO You can hold your breath indefinitely while you’re not incapacitated.
const UnendingBreath = notImplementedFeature("Unending Breath");

const MingleWithTheWindResource = new LongRestResource(
  "Mingle with the Wind",
  1
);
const MingleWithTheWindMethod = new InnateSpellcasting(
  "Mingle with the Wind",
  "con",
  () => MingleWithTheWindResource
);

const MingleWithTheWind = new SimpleFeature("Mingle with the Wind", (g, me) => {
  me.addResource(MingleWithTheWindResource);

  g.events.on("getActions", ({ detail: { who, actions } }) => {
    if (who === me)
      actions.push(
        new CastSpell(g, me, MingleWithTheWindMethod, new Levitate(g))
      );
  });
});

export const AirGenasi: PCRace = {
  parent: Genasi,
  name: "Air Genasi",
  size: "medium",
  abilities: new Map([["dex", 1]]),
  movement: new Map(),
  languages: new Set(),
  features: new Set([UnendingBreath, MingleWithTheWind]),
};
