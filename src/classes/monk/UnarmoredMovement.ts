import SimpleFeature from "../../features/SimpleFeature";
import { featureNotComplete } from "../../utils/env";

function getUnarmoredMovementBonus(level: number) {
  if (level < 6) return 10;
  if (level < 10) return 15;
  if (level < 14) return 20;
  if (level < 18) return 25;
  return 30;
}

const UnarmoredMovement = new SimpleFeature(
  "Unarmored Movement",
  `Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels, as shown in the Monk table.

At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.`,
  (g, me) => {
    const level = me.classLevels.get("Monk") ?? 2;
    if (level >= 9) featureNotComplete(UnarmoredMovement, me);

    const speed = getUnarmoredMovementBonus(level);
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who === me && !me.armor && !me.shield)
        bonus.add(speed, UnarmoredMovement);
    });

    // TODO At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.
  },
);
export default UnarmoredMovement;
