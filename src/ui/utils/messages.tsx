import BonusCollector from "../../collectors/BonusCollector";
import DiceTypeCollector from "../../collectors/DiceTypeCollector";
import SuccessResponseCollector from "../../collectors/SuccessResponseCollector";
import ValueCollector from "../../collectors/ValueCollector";
import { AbilityCheckDetail } from "../../events/AbilityCheckEvent";
import { AfterAttackDetail } from "../../events/AfterAttackEvent";
import { CombatantDamagedDetail } from "../../events/CombatantDamagedEvent";
import { CombatantDiedDetail } from "../../events/CombatantDiedEvent";
import { CombatantHealedDetail } from "../../events/CombatantHealedEvent";
import { CombatantInitiativeDetail } from "../../events/CombatantInitiativeEvent";
import { EffectAddedDetail } from "../../events/EffectAddedEvent";
import { EffectRemovedDetail } from "../../events/EffectRemovedEvent";
import { ExhaustionDetail } from "../../events/ExhaustionEvent";
import { SaveEventDetail } from "../../events/SaveEvent";
import { SpellCastDetail } from "../../events/SpellCastEvent";
import { Modifier, SpellSlot } from "../../flavours";
import MessageBuilder from "../../MessageBuilder";
import Combatant from "../../types/Combatant";
import DamageBreakdown from "../../types/DamageBreakdown";
import DamageType from "../../types/DamageType";
import DiceType from "../../types/DiceType";
import { AmmoItem, WeaponItem } from "../../types/Item";
import Spell from "../../types/Spell";
import { describeAbility, describeSave } from "../../utils/text";
import { isDefined } from "../../utils/types";
import CombatantRef from "../components/CombatantRef";
import common from "../components/common.module.scss";
import { VNode } from "../lib";

export type MessagePart = { element: VNode; text: string } | string | undefined;

const msgCombatant = (
  c: Combatant,
  spaceBefore = false,
  spaceAfter = true,
): MessagePart => ({
  element: (
    <CombatantRef who={c} spaceBefore={spaceBefore} spaceAfter={spaceAfter} />
  ),
  text: c.name,
});

const msgDiceType = (dt: DiceType): MessagePart =>
  dt !== "normal" ? { element: <> at {dt}</>, text: ` at ${dt}` } : undefined;

const msgWeapon = (w?: WeaponItem): MessagePart =>
  w ? { element: <> with {w.name}</>, text: ` with ${w.name}` } : undefined;

const msgSpell = (s?: Spell): MessagePart =>
  s ? { element: <> with {s.name}</>, text: ` with ${s.name}` } : undefined;

const msgAmmo = (a?: AmmoItem): MessagePart =>
  a
    ? { element: <>, firing {a.name}</>, text: `, firing ${a.name}` }
    : undefined;

const msgUpcast = (spell: Spell, slot: SpellSlot): MessagePart =>
  slot > spell.level
    ? { element: <> at level {slot}</>, text: ` at level ${slot}` }
    : undefined;

const msgNonzero = (value: number, text: string): MessagePart =>
  value ? { element: <>{text}</>, text } : undefined;

function getDamageEntryText([type, entry]: [
  type: DamageType,
  entry: DamageBreakdown,
]) {
  return `${entry.amount} ${type}${
    entry.response !== "normal" ? ` ${entry.response}` : ""
  }`;
}

const dmgBreakdown = (breakdown: Map<DamageType, DamageBreakdown>) => ({
  element: (
    <>
      (
      <div className={common.damageList}>
        {Array.from(breakdown, ([type, entry]) => (
          <span key={type}>{getDamageEntryText([type, entry])}</span>
        ))}
      </div>
      )
    </>
  ),
  text: `(${Array.from(breakdown, getDamageEntryText).join(", ")})`,
});

export const getAttackMessage = ({
  attack: {
    ac,
    total,
    roll: {
      diceType,
      type: { who, target, weapon, spell, ammo },
    },
  },
  outcome,
}: AfterAttackDetail) => [
  msgCombatant(who),
  outcome === "miss"
    ? " misses "
    : outcome === "hit"
      ? " hits "
      : " CRITICALLY hits ",
  msgCombatant(target, true),
  msgDiceType(diceType),
  msgWeapon(weapon),
  msgSpell(spell),
  msgAmmo(ammo),
  ` (${total}). (AC ${ac})`,
];

// TODO should probably not show you all this info...
export const getCastMessage = ({ level, spell, who }: SpellCastDetail) => [
  msgCombatant(who),
  " casts ",
  spell.name,
  msgUpcast(spell, level),
  ".",
];

export const getDamageMessage = ({
  who,
  total,
  breakdown,
}: CombatantDamagedDetail) => [
  msgCombatant(who),
  ` takes ${total} damage. `,
  dmgBreakdown(breakdown),
];

export const getDeathMessage = ({ who }: CombatantDiedDetail) => [
  msgCombatant(who),
  " dies!",
];

export const getEffectAddedMessage = ({ who, effect }: EffectAddedDetail) => [
  msgCombatant(who),
  ` gains effect: ${effect.name}.`,
];

export const getEffectRemovedMessage = ({
  who,
  effect,
}: EffectRemovedDetail) => [
  msgCombatant(who),
  ` loses effect: ${effect.name}.`,
];

export const getAbilityCheckMessage = ({
  diceType,
  roll: {
    type: { who, ability, skill },
  },
  total,
  dc,
}: AbilityCheckDetail) => [
  msgCombatant(who),
  ` gets a ${total}`,
  msgDiceType(diceType),
  " on a ",
  describeAbility(ability),
  skill ? ` (${skill})` : undefined,
  " ability check.",
  !isNaN(dc) ? `  (DC ${dc})` : "",
];

export const getInitiativeMessage = ({
  diceType,
  who,
  value,
}: CombatantInitiativeDetail) => [
  msgCombatant(who),
  ` gets a ${value}`,
  msgDiceType(diceType),
  " for initiative.",
];

export const getSaveMessage = ({
  diceType,
  roll: {
    type: { who, ability, tags },
  },
  forced,
  outcome,
  total,
  dc,
}: SaveEventDetail) => [
  msgCombatant(who),
  ...(forced
    ? [" automatically ", outcome === "success" ? "succeeds" : "fails"]
    : [` gets a ${total}`, msgDiceType(diceType)]),
  " on a ",
  describeSave(tags, ability),
  ` saving throw. (DC ${dc})`,
];

export const getHealedMessage = ({
  who,
  amount,
  fullAmount,
}: CombatantHealedDetail) => [
  msgCombatant(who),
  ` heals for ${amount}`,
  msgNonzero(fullAmount - amount, ` (${fullAmount - amount} wasted)`),
  ".",
];

export const getExhaustionMessage = ({ who, value }: ExhaustionDetail) => [
  msgCombatant(who),
  `now has ${value ? value : "no"} exhaustion.`,
];

export const getBuilderMessage = ({ data }: MessageBuilder) =>
  data.map((part) => {
    switch (part.type) {
      case "combatant":
        return msgCombatant(part.value, part.spaceBefore, part.spaceAfter);
      case "item":
        return part.value.name;
      case "text":
        return part.value;
    }
  });

const modAmount = (n: Modifier) => (n < 0 ? `${n}` : `+${n}`);

const getTextLines = (co: DiceTypeCollector | SuccessResponseCollector) => {
  const lines = co
    .getTaggedEntries()
    .map(
      ({ entry, ignored }) =>
        `${entry.source.name}: ${entry.value}${ignored ? " XXX" : ""}`,
    );

  return lines.length ? lines.join("\n") : undefined;
};

const getBonusLines = (co: BonusCollector) => {
  const lines = co
    .getTaggedEntries()
    .map(
      ({ entry, ignored }) =>
        `${entry.source.name}: ${modAmount(entry.value)}${
          ignored ? " XXX" : ""
        }`,
    );

  return lines.length ? lines.join("\n") : undefined;
};

const getRollLine = (co: ValueCollector) =>
  isNaN(co.final)
    ? undefined
    : `Roll: ${co.final}${
        co.others.length ? ` (${co.others.map(String).join(" ")})` : ""
      }`;

export const getInitiativeInfo = ({ pre, roll }: CombatantInitiativeDetail) =>
  [
    getTextLines(pre.diceType),
    getBonusLines(pre.bonus),
    getRollLine(roll.values),
  ]
    .filter(isDefined)
    .join("\n");

export const getAttackInfo = ({ attack: { pre, roll } }: AfterAttackDetail) =>
  [
    getTextLines(pre.success),
    getTextLines(pre.diceType),
    getBonusLines(pre.bonus),
    getRollLine(roll.values),
  ]
    .filter(isDefined)
    .join("\n");

export const getSaveInfo = ({ pre, roll }: SaveEventDetail) =>
  [
    getTextLines(pre.successResponse),
    getTextLines(pre.diceType),
    getBonusLines(pre.bonus),
    getRollLine(roll.values),
  ]
    .filter(isDefined)
    .join("\n");
