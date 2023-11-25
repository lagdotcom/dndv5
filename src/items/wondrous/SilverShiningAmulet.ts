import { ChannelDivinityResource } from "../../classes/paladin/common";
import Engine from "../../Engine";
import { Listener } from "../../events/Dispatcher";
import MessageBuilder from "../../MessageBuilder";
import { isEquipmentAttuned } from "../../utils/items";
import AbstractWondrous from "../AbstractWondrous";

export default class SilverShiningAmulet extends AbstractWondrous {
  constructor(
    g: Engine,
    private charged = true,
  ) {
    super(g, "Silver Shining Amulet", 0);
    this.attunement = true;
    this.rarity = "Rare";

    // While you wear the holy symbol, you gain a +1 bonus to spell attack rolls and the saving throw DCs of your spells.
    const giveBonus: Listener<"BeforeAttack" | "GetSaveDC"> = ({
      detail: { who, spell, bonus },
    }) => {
      if (isEquipmentAttuned(this, who) && spell) bonus.add(1, this);
    };
    g.events.on("BeforeAttack", giveBonus);
    g.events.on("GetSaveDC", giveBonus);

    // While you wear this amulet, you can use your Channel Divinity feature without expending one of the feature's uses. Once this property is used, it can't be used again until the next dawn.
    g.events.on("AfterAction", ({ detail: { action, config } }) => {
      const isAttuned = isEquipmentAttuned(this, action.actor);

      const isChannel =
        action.getResources(config).get(ChannelDivinityResource) ?? 0;

      if (isAttuned && isChannel && this.charged) {
        this.charged = false;
        action.actor.giveResource(ChannelDivinityResource, 1);

        g.text(
          new MessageBuilder()
            .co(action.actor)
            .nosp()
            .text("'s amulet shines briefly with divine light."),
        );
      }
    });

    // TODO The amulet sheds bright light in a 5-foot radius and dim light for an additional 5 feet. You may use a bonus action to change both of these radii to 30 feet, or to restore the original size. This light stays in effect as long as you remain within 100 feet of the amulet.
  }
}
