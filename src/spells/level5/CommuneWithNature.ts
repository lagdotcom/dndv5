import { simpleSpell } from "../common";
import { affectsSelf } from "../helpers";

const CommuneWithNature = simpleSpell({
  name: "Commune with Nature",
  level: 5,
  ritual: true,
  school: "Divination",
  time: "long",
  v: true,
  s: true,
  lists: ["Druid", "Ranger"],
  description: `You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn't function where nature has been replaced by construction, such as in dungeons and towns.

  You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area:
  - terrain and bodies of water
  - prevalent plants, minerals, animals, or peoples
  - powerful celestials, fey, fiends, elementals, or undead
  - influence from other planes of existence
  - buildings

  For example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.`,

  ...affectsSelf,

  getConfig: () => ({}),

  async apply() {
    // TODO
  },
});
export default CommuneWithNature;
