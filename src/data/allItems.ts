import {
  Arrow,
  BlowgunNeedle,
  CrossbowBolt,
  SlingBullet,
} from "../items/ammunition";
import {
  BreastplateArmor,
  ChainMailArmor,
  ChainShirtArmor,
  HalfPlateArmor,
  HideArmor,
  LeatherArmor,
  PaddedArmor,
  PlateArmor,
  RingMailArmor,
  ScaleMailArmor,
  Shield,
  SplintArmor,
  StuddedLeatherArmor,
} from "../items/armor";
import { GauntletsOfFlamingFury } from "../items/bgdia";
import { PariahsShield } from "../items/ggr";
import { ElvenChain } from "../items/srd/armor";
import { PotionOfGiantStrength, PotionOfHealing } from "../items/srd/potions";
import { ArrowCatchingShield } from "../items/srd/shields";
import BeltOfDwarvenkind from "../items/srd/wondrous/BeltOfDwarvenkind";
import BootsOfTheWinterlands from "../items/srd/wondrous/BootsOfTheWinterlands";
import BracersOfArchery from "../items/srd/wondrous/BracersOfArchery";
import BracersOfDefense from "../items/srd/wondrous/BracersOfDefense";
import BroochOfShielding from "../items/srd/wondrous/BroochOfShielding";
import CloakOfElvenkind from "../items/srd/wondrous/CloakOfElvenkind";
import CloakOfProtection from "../items/srd/wondrous/CloakOfProtection";
import DimensionalShackles from "../items/srd/wondrous/DimensionalShackles";
import FigurineOfWondrousPower from "../items/srd/wondrous/FigurineOfWondrousPower";
import {
  iounStoneOfAgility,
  iounStoneOfFortitude,
  iounStoneOfInsight,
  iounStoneOfIntellect,
  iounStoneOfLeadership,
  IounStoneOfMastery,
  IounStoneOfProtection,
  iounStoneOfStrength,
} from "../items/srd/wondrous/iounStones";
import {
  AmuletOfHealth,
  BeltOfGiantStrength,
  GauntletsOfOgrePower,
  HeadbandOfIntellect,
} from "../items/srd/wondrous/minimumScoreItems";
import { WandOfWeb } from "../items/srd/wondrous/wands";
import {
  Battleaxe,
  Blowgun,
  Club,
  Dagger,
  Dart,
  Flail,
  Glaive,
  Greataxe,
  Greatclub,
  Greatsword,
  Halberd,
  Handaxe,
  HandCrossbow,
  HeavyCrossbow,
  Javelin,
  Lance,
  LightCrossbow,
  LightHammer,
  Longbow,
  Longsword,
  Mace,
  Maul,
  Morningstar,
  Net,
  Pike,
  Quarterstaff,
  Rapier,
  Scimitar,
  Shortbow,
  Shortsword,
  Sickle,
  Sling,
  Spear,
  Trident,
  Warhammer,
  WarPick,
  Whip,
} from "../items/weapons";
import BracersOfTheArbalest from "../items/wondrous/BracersOfTheArbalest";
import DragonTouchedFocus from "../items/wondrous/DragonTouchedFocus";
import RingOfAwe from "../items/wondrous/RingOfAwe";
import SilverShiningAmulet from "../items/wondrous/SilverShiningAmulet";
import { ItemCreator } from "./BattleTemplate";

const srdItems = {
  // armor
  "padded armor": (g) => new PaddedArmor(g),
  "leather armor": (g) => new LeatherArmor(g),
  "studded leather armor": (g) => new StuddedLeatherArmor(g),
  "hide armor": (g) => new HideArmor(g),
  "chain shirt": (g) => new ChainShirtArmor(g),
  "scale mail": (g) => new ScaleMailArmor(g),
  breastplate: (g) => new BreastplateArmor(g),
  "half plate armor": (g) => new HalfPlateArmor(g),
  "ring mail": (g) => new RingMailArmor(g),
  "chain mail": (g) => new ChainMailArmor(g),
  "splint armor": (g) => new SplintArmor(g),
  "plate armor": (g) => new PlateArmor(g),
  shield: (g) => new Shield(g),

  // simple melee
  club: (g) => new Club(g),
  dagger: (g) => new Dagger(g),
  greatclub: (g) => new Greatclub(g),
  handaxe: (g) => new Handaxe(g),
  javelin: (g) => new Javelin(g),
  "light hammer": (g) => new LightHammer(g),
  mace: (g) => new Mace(g),
  quarterstaff: (g) => new Quarterstaff(g),
  sickle: (g) => new Sickle(g),
  spear: (g) => new Spear(g),

  // simple ranged
  dart: (g) => new Dart(g),
  "light crossbow": (g) => new LightCrossbow(g),
  sling: (g) => new Sling(g),
  shortbow: (g) => new Shortbow(g),

  // martial melee
  battleaxe: (g) => new Battleaxe(g),
  flail: (g) => new Flail(g),
  glaive: (g) => new Glaive(g),
  greataxe: (g) => new Greataxe(g),
  greatsword: (g) => new Greatsword(g),
  halberd: (g) => new Halberd(g),
  lance: (g) => new Lance(g),
  longsword: (g) => new Longsword(g),
  maul: (g) => new Maul(g),
  morningstar: (g) => new Morningstar(g),
  pike: (g) => new Pike(g),
  rapier: (g) => new Rapier(g),
  scimitar: (g) => new Scimitar(g),
  shortsword: (g) => new Shortsword(g),
  trident: (g) => new Trident(g),
  warhammer: (g) => new Warhammer(g),
  "war pick": (g) => new WarPick(g),
  whip: (g) => new Whip(g),

  // martial ranged
  blowgun: (g) => new Blowgun(g),
  "hand crossbow": (g) => new HandCrossbow(g),
  "heavy crossbow": (g) => new HeavyCrossbow(g),
  longbow: (g) => new Longbow(g),
  net: (g) => new Net(g),

  // ammunition
  arrow: (g) => new Arrow(g),
  "blowgun needle": (g) => new BlowgunNeedle(g),
  "crossbow bolt": (g) => new CrossbowBolt(g),
  "sling bullet": (g) => new SlingBullet(g),

  // potions
  "potion of healing": (g) => new PotionOfHealing(g, "standard"),
  "potion of greater healing": (g) => new PotionOfHealing(g, "greater"),
  "potion of superior healing": (g) => new PotionOfHealing(g, "superior"),
  "potion of supreme healing": (g) => new PotionOfHealing(g, "supreme"),

  "potion of hill giant strength": (g) => new PotionOfGiantStrength(g, "Hill"),
  "potion of stone giant strength": (g) =>
    new PotionOfGiantStrength(g, "Stone"),
  "potion of frost giant strength": (g) =>
    new PotionOfGiantStrength(g, "Frost"),
  "potion of fire giant strength": (g) => new PotionOfGiantStrength(g, "Fire"),
  "potion of cloud giant strength": (g) =>
    new PotionOfGiantStrength(g, "Cloud"),
  "potion of storm giant strength": (g) =>
    new PotionOfGiantStrength(g, "Storm"),

  // shields
  "arrow-catching shield": (g) => new ArrowCatchingShield(g),

  // wands
  "wand of web": (g) => new WandOfWeb(g),

  // wondrous
  "amulet of health": (g) => new AmuletOfHealth(g),
  "belt of dwarvenkind": (g) => new BeltOfDwarvenkind(g),
  "belt of hill giant strength": (g) => new BeltOfGiantStrength(g, "Hill"),
  "belt of stone giant strength": (g) => new BeltOfGiantStrength(g, "Stone"),
  "belt of frost giant strength": (g) => new BeltOfGiantStrength(g, "Frost"),
  "belt of fire giant strength": (g) => new BeltOfGiantStrength(g, "Fire"),
  "belt of cloud giant strength": (g) => new BeltOfGiantStrength(g, "Cloud"),
  "belt of storm giant strength": (g) => new BeltOfGiantStrength(g, "Storm"),
  "boots of the winterlands": (g) => new BootsOfTheWinterlands(g),
  "bracers of archery": (g) => new BracersOfArchery(g),
  "bracers of defense": (g) => new BracersOfDefense(g),
  "brooch of shielding": (g) => new BroochOfShielding(g),
  "cloak of elvenkind": (g) => new CloakOfElvenkind(g),
  "cloak of protection": (g) => new CloakOfProtection(g),
  "dimensional shackles": (g) => new DimensionalShackles(g),
  "elven chain": (g) => new ElvenChain(g),
  "figurine of wondrous power, bronze griffin": (g) =>
    new FigurineOfWondrousPower(g, "Bronze Griffin"),
  "figurine of wondrous power, ebony fly": (g) =>
    new FigurineOfWondrousPower(g, "Ebony Fly"),
  "figurine of wondrous power, golden lions": (g) =>
    new FigurineOfWondrousPower(g, "Golden Lions"),
  "figurine of wondrous power, ivory goats": (g) =>
    new FigurineOfWondrousPower(g, "Ivory Goats"),
  "figurine of wondrous power, marble elephant": (g) =>
    new FigurineOfWondrousPower(g, "Marble Elephant"),
  "figurine of wondrous power, obsidian steed": (g) =>
    new FigurineOfWondrousPower(g, "Obsidian Steed"),
  "figurine of wondrous power, onyx dog": (g) =>
    new FigurineOfWondrousPower(g, "Onyx Dog"),
  "figurine of wondrous power, serpentine owl": (g) =>
    new FigurineOfWondrousPower(g, "Serpentine Owl"),
  "figurine of wondrous power, silver raven": (g) =>
    new FigurineOfWondrousPower(g, "Silver Raven"),
  "gauntlets of ogre power": (g) => new GauntletsOfOgrePower(g),
  "Ioun stone of agility": iounStoneOfAgility,
  "Ioun stone of fortitude": iounStoneOfFortitude,
  "Ioun stone of insight": iounStoneOfInsight,
  "Ioun stone of intellect": iounStoneOfIntellect,
  "Ioun stone of leadership": iounStoneOfLeadership,
  "Ioun stone of mastery": (g) => new IounStoneOfMastery(g),
  "Ioun stone of protection": (g) => new IounStoneOfProtection(g),
  "Ioun stone of strength": iounStoneOfStrength,
  "headband of intellect": (g) => new HeadbandOfIntellect(g),
} as const satisfies Record<string, ItemCreator>;

const allItems = {
  ...srdItems,

  // BGDIA
  "gauntlets of flaming fury": (g) => new GauntletsOfFlamingFury(g),

  // GGR
  "pariah's shield": (g) => new PariahsShield(g),

  // TCE
  "dragon-touched focus (slumbering)": (g) =>
    new DragonTouchedFocus(g, "Slumbering"),
  "dragon-touched focus (stirring)": (g) =>
    new DragonTouchedFocus(g, "Stirring"),
  "dragon-touched focus (wakened)": (g) => new DragonTouchedFocus(g, "Wakened"),
  "dragon-touched focus (ascendant)": (g) =>
    new DragonTouchedFocus(g, "Ascendant"),

  // homebrew
  "bracers of the arbalest": (g) => new BracersOfTheArbalest(g),
  "ring of awe": (g) => new RingOfAwe(g),
  "silver shining amulet": (g) => new SilverShiningAmulet(g),
} as const satisfies Record<string, ItemCreator>;
export default allItems;

export type ItemName = keyof typeof allItems;
