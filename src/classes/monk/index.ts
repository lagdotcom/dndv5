import { notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import PCClass from "../../types/PCClass";

const UnarmoredDefense = new SimpleFeature("Unarmored Defense", (g, me) => {
  g.events.on("getACMethods", ({ detail: { who, methods } }) => {
    if (who === me && !me.armor && !me.shield)
      methods.push({
        name: "Unarmored Defense",
        ac: 10 + me.dex + me.wis,
        uses: new Set(),
      });
  });
});

const MartialArts = notImplementedFeature("Martial Arts");

const Monk: PCClass = {
  name: "Monk",
  hitDieSize: 8,
  armorProficiencies: new Set(),
  weaponCategoryProficiencies: new Set(["simple"]),
  weaponProficiencies: new Set(["shortsword"]),
  saveProficiencies: new Set(["str", "dex"]),
  skillChoices: 2,
  skillProficiencies: new Set([
    "Acrobatics",
    "Athletics",
    "History",
    "Insight",
    "Religion",
    "Stealth",
  ]),

  features: new Map([[1, [UnarmoredDefense, MartialArts]]]),
};
export default Monk;
