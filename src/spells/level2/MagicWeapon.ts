import iconUrl from "@img/spl/magic-weapon.svg";

import { makeIcon } from "../../colours";
import { getWeaponPlusHandler } from "../../enchantments/plus";
import Engine from "../../Engine";
import MessageBuilder from "../../MessageBuilder";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import SubscriptionBag from "../../SubscriptionBag";
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
  oldColour?: string;
  bag: SubscriptionBag;

  constructor(
    public g: Engine,
    public caster: Combatant,
    public slot: number,
    public item: WeaponItem,
    public bonus = slotToBonus(slot),
  ) {
    const handler = getWeaponPlusHandler(item, bonus, MagicWeapon);
    this.bag = new SubscriptionBag(
      g.events.on("BeforeAttack", handler),
      g.events.on("GatherDamage", handler),
    );

    this.oldName = item.name;
    this.oldColour = item.icon?.colour;

    item.magical = true;
    item.name = `${item.name} (Magic Weapon +${bonus})`;
    if (item.icon) item.icon.colour = "purple";

    g.text(
      new MessageBuilder()
        .co(caster)
        .nosp()
        .text("'s ")
        .it(item)
        .text(" shines with magical light."),
    );
  }

  onSpellEnd = async () => {
    const { item, oldName, oldColour, bag } = this;

    item.magical = false;
    item.name = oldName;
    if (item.icon) item.icon.colour = oldColour;
    bag.cleanup();

    const msg = new MessageBuilder();
    if (item.possessor) msg.co(item.possessor).nosp().text("'s ");
    this.g.text(msg.it(this.item).text(" loses its shine."));
  };
}

const MagicWeapon = scalingSpell<{ item: WeaponItem }>({
  status: "implemented",
  name: "Magic Weapon",
  icon: makeIcon(iconUrl),
  level: 2,
  school: "Transmutation",
  concentration: true,
  time: "bonus action",
  v: true,
  s: true,
  lists: ["Artificer", "Paladin", "Wizard"],
  description: `You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3.`,

  getConfig: (g, caster) => ({
    item: new ChoiceResolver(
      g,
      caster.weapons
        .filter((w) => !w.magical && w.category !== "natural")
        .map((value) => ({ label: value.name, value })),
    ),
  }),
  getTargets: (g, caster) => [caster],
  getAffected: (g, caster) => [caster],

  async apply({ g, caster }, { slot, item }) {
    const controller = new MagicWeaponController(g, caster, slot, item);

    caster.concentrateOn({
      duration: hours(1),
      spell: MagicWeapon,
      onSpellEnd: controller.onSpellEnd,
    });
  },
});
export default MagicWeapon;
