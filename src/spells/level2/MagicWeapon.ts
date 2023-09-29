import { getWeaponPlusHandler } from "../../enchantments/plus";
import Engine from "../../Engine";
import { Unsubscribe } from "../../events/Dispatcher";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import Combatant from "../../types/Combatant";
import { WeaponItem } from "../../types/Item";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";

function slotToBonus(slot: number) {
  if (slot >= 6) return 3;
  if (slot >= 4) return 2;
  return 1;
}

class MagicWeaponController {
  oldName: string;
  subscriptions: Unsubscribe[];

  constructor(
    public g: Engine,
    public caster: Combatant,
    public slot: number,
    public item: WeaponItem,
    public bonus = slotToBonus(slot),
  ) {
    const handler = getWeaponPlusHandler(item, bonus, MagicWeapon);
    this.subscriptions = [
      g.events.on("BeforeAttack", handler),
      g.events.on("GatherDamage", handler),
    ];

    this.oldName = item.name;
    item.magical = true;
    item.name = `${item.name} (Magic Weapon +${bonus})`;
  }

  onSpellEnd = async () => {
    this.item.magical = false;
    this.item.name = this.oldName;
    for (const cleanup of this.subscriptions) cleanup();
  };
}

const MagicWeapon = scalingSpell<{ item: WeaponItem }>({
  status: "implemented",
  name: "Magic Weapon",
  level: 2,
  school: "Transmutation",
  concentration: true,
  time: "bonus action",
  v: true,
  s: true,
  lists: ["Artificer", "Paladin", "Wizard"],

  getConfig: (g, caster) => ({
    item: new ChoiceResolver(
      g,
      caster.weapons
        .filter((w) => !w.magical && w.category !== "natural")
        .map((value) => ({ label: value.name, value })),
    ),
  }),
  getTargets: (g, caster) => [caster],

  async apply(g, caster, method, { slot, item }) {
    const controller = new MagicWeaponController(g, caster, slot, item);

    caster.concentrateOn({
      duration: hours(1),
      spell: MagicWeapon,
      onSpellEnd: controller.onSpellEnd,
    });
  },
});
export default MagicWeapon;
