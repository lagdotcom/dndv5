import SimpleFeature from "../../features/SimpleFeature";
import { abSet } from "../../types/AbilityName";
import { wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { skSet } from "../../types/SkillName";
import MartialArts from "./MartialArts";

const UnarmoredDefense = new SimpleFeature(
  "Unarmored Defense",
  `Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.`,
  (g, me) => {
    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (who === me && !me.armor && !me.shield)
        methods.push({
          name: "Unarmored Defense",
          ac: 10 + me.dex.modifier + me.wis.modifier,
          uses: new Set(),
        });
    });
  },
);

const Monk: PCClass = {
  name: "Monk",
  hitDieSize: 8,
  weaponCategoryProficiencies: wcSet("simple"),
  weaponProficiencies: new Set(["shortsword"]),
  saveProficiencies: abSet("str", "dex"),
  skillChoices: 2,
  skillProficiencies: skSet(
    "Acrobatics",
    "Athletics",
    "History",
    "Insight",
    "Religion",
    "Stealth",
  ),

  features: new Map([[1, [UnarmoredDefense, MartialArts]]]),
};
export default Monk;
