import { ClassColours, makeIcon } from "../../colours";
import { ShortRestResource } from "../../resources";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import iconUrl from "./icon.svg";

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

export const ChannelDivinityResource = new ShortRestResource(
  "Channel Divinity",
  1,
);

export function getPaladinAuraRadius(level: number) {
  if (level < 18) return 10;
  return 30;
}
