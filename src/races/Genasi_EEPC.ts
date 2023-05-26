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
};

// TODO
const UnendingBreath = notImplementedFeature(
  "Unending Breath",
  `You can hold your breath indefinitely while you’re not incapacitated.`
);

const MingleWithTheWindResource = new LongRestResource(
  "Mingle with the Wind",
  1
);
const MingleWithTheWindMethod = new InnateSpellcasting(
  "Mingle with the Wind",
  "con",
  () => MingleWithTheWindResource
);

const MingleWithTheWind = new SimpleFeature(
  "Mingle with the Wind",
  `You can cast the levitate spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for this spell.`,
  (g, me) => {
    me.addResource(MingleWithTheWindResource);

    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(
          new CastSpell(g, me, MingleWithTheWindMethod, new Levitate(g))
        );
    });
  }
);

export const AirGenasi: PCRace = {
  parent: Genasi,
  name: "Air Genasi",
  size: "medium",
  abilities: new Map([["dex", 1]]),
  features: new Set([UnendingBreath, MingleWithTheWind]),
};
