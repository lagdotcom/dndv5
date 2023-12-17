import thugUrl from "@img/tok/thug.png";

import Engine from "../../Engine";
import { CrossbowBolt } from "../../items/srd/ammunition";
import { LeatherArmor } from "../../items/srd/armor";
import { HeavyCrossbow, Mace } from "../../items/srd/weapons";
import Monster from "../../Monster";
import SizeCategory from "../../types/SizeCategory";
import { isMeleeAttackAction, makeMultiattack, PackTactics } from "../common";

export class Thug extends Monster {
  constructor(g: Engine, wieldingCrossbow = false) {
    super(g, "thug", 0.5, "humanoid", SizeCategory.Medium, thugUrl, 32);
    this.don(new LeatherArmor(g), true);
    this.movement.set("speed", 30);
    this.setAbilityScores(15, 11, 14, 10, 10, 11);
    this.addProficiency("Intimidation", "proficient");
    this.languages.add("Common");

    this.addFeature(PackTactics);
    this.addFeature(
      makeMultiattack("The thug makes two melee attacks.", (me, action) => {
        if (me.attacksSoFar.length !== 1) return false;
        const [previous] = me.attacksSoFar;
        return isMeleeAttackAction(previous) && isMeleeAttackAction(action);
      }),
    );

    const mace = new Mace(g);
    const crossbow = new HeavyCrossbow(g);

    if (wieldingCrossbow) {
      this.don(crossbow, true);

      this.inventory.add(mace);
      this.weaponProficiencies.add("mace");
    } else {
      this.don(mace, true);

      this.inventory.add(crossbow);
      this.weaponProficiencies.add("heavy crossbow");
    }

    this.inventory.add(new CrossbowBolt(g, Infinity));
  }
}
