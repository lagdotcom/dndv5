import { ShortRestResource } from "../../resources";
import NormalSpellcasting from "../../spells/NormalSpellcasting";

export const PaladinSpellcasting = new NormalSpellcasting(
  "Paladin",
  `By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.`,
  "cha",
  "half",
  "Paladin",
  "Paladin"
);

export const ChannelDivinityResource = new ShortRestResource(
  "Channel Divinity",
  1
);
