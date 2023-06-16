import {
  nonCombatFeature,
  notImplementedFeature,
} from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import MultiListChoice from "../../../interruptions/MultiListChoice";
import PCSubclass from "../../../types/PCSubclass";

const EvocationSavant = nonCombatFeature(
  "Evocation Savant",
  `Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved.`
);

const SculptSpells = new SimpleFeature(
  "Sculpt Spells",
  `Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.`,
  (g, me) => {
    g.events.on(
      "SpellCast",
      ({ detail: { who, spell, level, targets, interrupt } }) => {
        if (who === me && spell.school === "Evocation")
          interrupt.add(
            new MultiListChoice(
              me,
              SculptSpells,
              "Sculpt Spells",
              `Pick combatants who will be somewhat protected from your spell.`,
              Array.from(targets).map((value) => ({
                value,
                label: value.name,
              })),
              0,
              level + 1,
              async (chosen) => {
                for (const target of chosen) {
                  const unsubscribe = g.events.on(
                    "BeforeSave",
                    ({
                      detail: {
                        who,
                        spell: saveSpell,
                        attacker,
                        successResponse,
                        saveDamageResponse,
                      },
                    }) => {
                      if (
                        attacker === me &&
                        who === target &&
                        saveSpell === spell
                      ) {
                        successResponse.add("success", SculptSpells);
                        saveDamageResponse.add("zero", SculptSpells);
                        unsubscribe();
                      }
                    }
                  );
                }
              }
            )
          );
      }
    );
  }
);

const PotentCantrip = new SimpleFeature(
  "Potent Cantrip",
  `Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip.`,
  (g, me) => {
    g.events.on(
      "BeforeSave",
      ({ detail: { attacker, spell, saveDamageResponse } }) => {
        if (attacker === me && spell?.level === 0)
          saveDamageResponse.add("half", PotentCantrip);
      }
    );
  }
);

// TODO
const EmpoweredEvocation = notImplementedFeature(
  "Empowered Evocation",
  `Beginning at 10th level, you can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.`
);

// TODO
const Overchannel = notImplementedFeature(
  "Overchannel",
  `Starting at 14th level, you can increase the power of your simpler spells. When you cast a wizard spell of 1st through 5th-level that deals damage, you can deal maximum damage with that spell.

The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity.`
);

const Evocation: PCSubclass = {
  name: "Evocation",
  className: "Wizard",
  features: new Map([
    [2, [EvocationSavant, SculptSpells]],
    [6, [PotentCantrip]],
    [10, [EmpoweredEvocation]],
    [14, [Overchannel]],
  ]),
};
export default Evocation;
