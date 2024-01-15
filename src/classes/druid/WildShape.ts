import AbstractAction from "../../actions/AbstractAction";
import allMonsters, { MonsterName } from "../../data/allMonsters";
import initialiseMonster from "../../data/initialiseMonster";
import MonsterTemplate from "../../data/MonsterTemplate";
import Engine from "../../Engine";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import { Score } from "../../flavours";
import MessageBuilder from "../../MessageBuilder";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import { ShortRestResource } from "../../resources";
import SubscriptionBag from "../../SubscriptionBag";
import Combatant from "../../types/Combatant";
import Feature from "../../types/Feature";
import { featureNotComplete } from "../../utils/env";

interface HasForm {
  form: MonsterName;
}

const WildShapeResource = new ShortRestResource("Wild Shape", 2);

type DruidBackup = Pick<
  Combatant,
  | "name"
  | "img"
  | "type"
  | "size"
  | "hands"
  | "reach"
  | "hp"
  | "baseHpMax"
  | "movement"
  | "skills"
  | "equipment"
  | "inventory"
  | "senses"
  | "naturalWeapons"
  | "damageResponses"
>;

class WildShapeController {
  backup: DruidBackup;
  str: Score;
  dex: Score;
  con: Score;
  removeFeatures: Set<Feature>;
  bag: SubscriptionBag;

  constructor(
    public g: Engine,
    public me: Combatant,
    public formName: MonsterName,
    // TODO fix this so it doesn't need to actually make one
    public form = initialiseMonster(
      g,
      allMonsters[formName] as MonsterTemplate<unknown>,
      {},
    ),
  ) {
    this.backup = {
      name: me.name,
      img: me.img,
      type: me.type,
      size: me.size,
      hands: me.hands,
      reach: me.reach,
      hp: me.hp,
      baseHpMax: me.baseHpMax,
      movement: me.movement,
      skills: me.skills,
      equipment: me.equipment,
      inventory: me.inventory,
      senses: me.senses,
      naturalWeapons: me.naturalWeapons,
      damageResponses: me.damageResponses,
    };

    this.str = me.str.score;
    this.dex = me.dex.score;
    this.con = me.con.score;

    this.removeFeatures = new Set();
    for (const [name, feature] of form.features) {
      if (!me.features.has(name)) this.removeFeatures.add(feature);
    }

    this.bag = new SubscriptionBag();
  }

  async apply() {
    const { g, me, form } = this;

    this.g.text(
      new MessageBuilder()
        .co(me, me.name)
        .text(` transforms into a ${form.name}.`),
    );

    me.name = `${form.name} (${me.name})`;
    me.img = form.img;
    me.type = form.type;
    me.size = form.size;
    me.hands = form.hands;
    me.reach = form.reach;
    me.baseHpMax = form.baseHpMax;
    me.hp = form.hpMax;
    me.movement = form.movement;
    me.skills; // TODO
    me.equipment = new Set();
    me.inventory = new Map();
    me.senses = form.senses;
    me.naturalWeapons = form.naturalWeapons;
    me.str.score = form.str.score;
    me.dex.score = form.dex.score;
    me.con.score = form.con.score;
    me.damageResponses = form.damageResponses;

    const closeTap = g.events.tap((cleanup) => this.bag.add(cleanup));
    for (const [name, feature] of form.features) {
      me.addFeature(feature);
      feature.setup(g, me, form.getConfig(name));
    }
    closeTap();

    /* TODO
While you are transformed, the following rules apply:

- Your game statistics are replaced by the statistics of the beast, but you retain your alignment, personality, and Intelligence, Wisdom, and Charisma scores. You also retain all of your skill and saving throw proficiencies, in addition to gaining those of the creature. If the creature has the same proficiency as you and the bonus in its stat block is higher than yours, use the creature's bonus instead of yours. If the creature has any legendary or lair actions, you can't use them.
- When you transform, you assume the beast's hit points and Hit Dice. When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form. For example, if you take 10 damage in animal form and have only 1 hit point left, you revert and take 9 damage. As long as the excess damage doesn't reduce your normal form to 0 hit points, you aren't knocked unconscious.
- You can't cast spells, and your ability to speak or take any action that requires hands is limited to the capabilities of your beast form. Transforming doesn't break your concentration on a spell you've already cast, however, or prevent you from taking actions that are part of a spell, such as call lightning, that you've already cast.
- You retain the benefit of any features from your class, race, or other source and can use them if the new form is physically capable of doing so. However, you can't use any of your special senses, such as darkvision, unless your new form also has that sense.
- You choose whether your equipment falls to the ground in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the DM decides whether it is practical for the new form to wear a piece of equipment, based on the creature's shape and size. Your equipment doesn't change size or shape to match the new form, and any equipment that the new form can't wear must either fall to the ground or merge with it. Equipment that merges with the form has no effect until you leave the form.
    */

    this.bag.add(
      // You can revert to your normal form earlier by using a bonus action on your turn.
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) actions.push(new RevertAction(g, me, this));
      }),

      // TODO You automatically revert if you fall unconscious, drop to 0 hit points, or die.
      g.events.on("CombatantDamaged", ({ detail: { who } }) => {
        if (who === me && me.hp <= 0) {
          const rollover = me.hp;
          this.remove();

          me.hp += rollover;
        }
      }),

      // You can't cast spells
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.actor === me && action.tags.has("spell"))
          error.add("cannot cast spells", WildShape);
      }),
    );
  }

  remove() {
    const { me, backup, str, dex, con, removeFeatures, bag, g } = this;

    Object.assign(me, backup);

    me.str.score = str;
    me.dex.score = dex;
    me.con.score = con;

    for (const feature of removeFeatures) me.features.delete(feature.name);

    bag.cleanup();

    g.text(new MessageBuilder().co(me).text(" returns to their normal form."));
  }
}

class RevertAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public controller: WildShapeController,
  ) {
    super(g, actor, "Revert Form", "implemented", {}, { time: "bonus action" });
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  async apply(config: never) {
    await super.apply(config);
    this.controller.remove();
  }
}

class WildShapeAction extends AbstractAction<HasForm> {
  constructor(
    g: Engine,
    actor: Combatant,
    public forms: MonsterName[],
  ) {
    super(
      g,
      actor,
      "Wild Shape",
      "incomplete",
      {
        form: new ChoiceResolver(
          g,
          forms.map((value) => ({ value, label: value })),
        ),
      },
      { time: "action", resources: [[WildShapeResource, 1]] },
    );
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  async apply({ form }: HasForm) {
    await super.apply({ form });

    const controller = new WildShapeController(this.g, this.actor, form);
    await controller.apply();
  }
}

const WildShape = new ConfiguredFeature<MonsterName[]>(
  "Wild Shape",
  `Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.`,
  (g, me, forms) => {
    featureNotComplete(WildShape, me);
    me.initResource(WildShapeResource);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      // TODO if you wild shape again, weird things will happen
      if (who === me) actions.push(new WildShapeAction(g, me, forms));
    });
  },
);
export default WildShape;
