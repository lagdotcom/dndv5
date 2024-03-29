import iconUrl from "@img/class/paladin.svg";

import { ClassColours, makeIcon } from "../../colours";
import NormalSpellcasting from "../../spells/NormalSpellcasting";

export const PaladinIcon = makeIcon(iconUrl, ClassColours.Paladin);

export const PaladinSpellcasting = new NormalSpellcasting(
  "Paladin",
  `By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.`,
  "cha",
  "half",
  "Paladin",
  "Paladin",
  PaladinIcon,
);
