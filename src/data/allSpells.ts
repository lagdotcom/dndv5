import AcidSplash from "../spells/cantrip/AcidSplash";
import BladeWard from "../spells/cantrip/BladeWard";
import ChillTouch from "../spells/cantrip/ChillTouch";
import EldritchBlast from "../spells/cantrip/EldritchBlast";
import FireBolt from "../spells/cantrip/FireBolt";
import Guidance from "../spells/cantrip/Guidance";
import Gust from "../spells/cantrip/Gust";
import MagicStone from "../spells/cantrip/MagicStone";
import MindSliver from "../spells/cantrip/MindSliver";
import PoisonSpray from "../spells/cantrip/PoisonSpray";
import PrimalSavagery from "../spells/cantrip/PrimalSavagery";
import ProduceFlame from "../spells/cantrip/ProduceFlame";
import RayOfFrost from "../spells/cantrip/RayOfFrost";
import Resistance from "../spells/cantrip/Resistance";
import SacredFlame from "../spells/cantrip/SacredFlame";
import Shillelagh from "../spells/cantrip/Shillelagh";
import ShockingGrasp from "../spells/cantrip/ShockingGrasp";
import SpareTheDying from "../spells/cantrip/SpareTheDying";
import Thaumaturgy from "../spells/cantrip/Thaumaturgy";
import Thunderclap from "../spells/cantrip/Thunderclap";
import ViciousMockery from "../spells/cantrip/ViciousMockery";
import ArmorOfAgathys from "../spells/level1/ArmorOfAgathys";
import Bless from "../spells/level1/Bless";
import BurningHands from "../spells/level1/BurningHands";
import CharmPerson from "../spells/level1/CharmPerson";
import Command from "../spells/level1/Command";
import CureWounds from "../spells/level1/CureWounds";
import DivineFavor from "../spells/level1/DivineFavor";
import EarthTremor from "../spells/level1/EarthTremor";
import Entangle from "../spells/level1/Entangle";
import FaerieFire from "../spells/level1/FaerieFire";
import FogCloud from "../spells/level1/FogCloud";
import GuidingBolt from "../spells/level1/GuidingBolt";
import HealingWord from "../spells/level1/HealingWord";
import HellishRebuke from "../spells/level1/HellishRebuke";
import HideousLaughter from "../spells/level1/HideousLaughter";
import IceKnife from "../spells/level1/IceKnife";
import InflictWounds from "../spells/level1/InflictWounds";
import Longstrider from "../spells/level1/Longstrider";
import MageArmor from "../spells/level1/MageArmor";
import MagicMissile from "../spells/level1/MagicMissile";
import ProtectionFromEvilAndGood from "../spells/level1/ProtectionFromEvilAndGood";
import Sanctuary from "../spells/level1/Sanctuary";
import Shield from "../spells/level1/Shield";
import ShieldOfFaith from "../spells/level1/ShieldOfFaith";
import Sleep from "../spells/level1/Sleep";
import Thunderwave from "../spells/level1/Thunderwave";
import Aid from "../spells/level2/Aid";
import Barkskin from "../spells/level2/Barkskin";
import Blur from "../spells/level2/Blur";
import Darkness from "../spells/level2/Darkness";
import EnlargeReduce from "../spells/level2/EnlargeReduce";
import GustOfWind from "../spells/level2/GustOfWind";
import HoldPerson from "../spells/level2/HoldPerson";
import LesserRestoration from "../spells/level2/LesserRestoration";
import Levitate from "../spells/level2/Levitate";
import MagicWeapon from "../spells/level2/MagicWeapon";
import MirrorImage from "../spells/level2/MirrorImage";
import MistyStep from "../spells/level2/MistyStep";
import Moonbeam from "../spells/level2/Moonbeam";
import Silence from "../spells/level2/Silence";
import SpiderClimb from "../spells/level2/SpiderClimb";
import SpikeGrowth from "../spells/level2/SpikeGrowth";
import Web from "../spells/level2/Web";
import Counterspell from "../spells/level3/Counterspell";
import EruptingEarth from "../spells/level3/EruptingEarth";
import Fireball from "../spells/level3/Fireball";
import IntellectFortress from "../spells/level3/IntellectFortress";
import LightningBolt from "../spells/level3/LightningBolt";
import MassHealingWord from "../spells/level3/MassHealingWord";
import MeldIntoStone from "../spells/level3/MeldIntoStone";
import MelfsMinuteMeteors from "../spells/level3/MelfsMinuteMeteors";
import SleetStorm from "../spells/level3/SleetStorm";
import Slow from "../spells/level3/Slow";
import SpiritGuardians from "../spells/level3/SpiritGuardians";
import WallOfWater from "../spells/level3/WallOfWater";
import WaterBreathing from "../spells/level3/WaterBreathing";
import WaterWalk from "../spells/level3/WaterWalk";
import CharmMonster from "../spells/level4/CharmMonster";
import ControlWater from "../spells/level4/ControlWater";
import FireShield from "../spells/level4/FireShield";
import FreedomOfMovement from "../spells/level4/FreedomOfMovement";
import GuardianOfNature from "../spells/level4/GuardianOfNature";
import IceStorm from "../spells/level4/IceStorm";
import Stoneskin from "../spells/level4/Stoneskin";
import WallOfFire from "../spells/level4/WallOfFire";
import CommuneWithNature from "../spells/level5/CommuneWithNature";
import ConeOfCold from "../spells/level5/ConeOfCold";
import ConjureElemental from "../spells/level5/ConjureElemental";
import MeteorSwarm from "../spells/level9/MeteorSwarm";

const allSpells = {
  "acid splash": AcidSplash,
  "blade ward": BladeWard,
  "chill touch": ChillTouch,
  "eldritch blast": EldritchBlast,
  "fire bolt": FireBolt,
  guidance: Guidance,
  gust: Gust,
  "magic stone": MagicStone,
  "mind sliver": MindSliver,
  "poison spray": PoisonSpray,
  "primal savagery": PrimalSavagery,
  "produce flame": ProduceFlame,
  "ray of frost": RayOfFrost,
  resistance: Resistance,
  "sacred flame": SacredFlame,
  shillelagh: Shillelagh,
  "shocking grasp": ShockingGrasp,
  "spare the dying": SpareTheDying,
  thaumaturgy: Thaumaturgy,
  thunderclap: Thunderclap,
  "vicious mockery": ViciousMockery,

  "armor of Agathys": ArmorOfAgathys,
  bless: Bless,
  "burning hands": BurningHands,
  "charm person": CharmPerson,
  command: Command,
  "cure wounds": CureWounds,
  "divine favor": DivineFavor,
  "earth tremor": EarthTremor,
  entangle: Entangle,
  "faerie fire": FaerieFire,
  "fog cloud": FogCloud,
  "guiding bolt": GuidingBolt,
  "healing word": HealingWord,
  "hellish rebuke": HellishRebuke,
  "hideous laughter": HideousLaughter,
  "ice knife": IceKnife,
  "inflict wounds": InflictWounds,
  longstrider: Longstrider,
  "mage armor": MageArmor,
  "magic missile": MagicMissile,
  "protection from evil and good": ProtectionFromEvilAndGood,
  sanctuary: Sanctuary,
  shield: Shield,
  "shield of faith": ShieldOfFaith,
  sleep: Sleep,
  thunderwave: Thunderwave,

  aid: Aid,
  barkskin: Barkskin,
  blur: Blur,
  darkness: Darkness,
  "enlarge/reduce": EnlargeReduce,
  "gust of wind": GustOfWind,
  "hold person": HoldPerson,
  "lesser restoration": LesserRestoration,
  levitate: Levitate,
  "magic weapon": MagicWeapon,
  "mirror image": MirrorImage,
  "misty step": MistyStep,
  moonbeam: Moonbeam,
  silence: Silence,
  "spider climb": SpiderClimb,
  "spike growth": SpikeGrowth,
  web: Web,

  counterspell: Counterspell,
  "erupting earth": EruptingEarth,
  fireball: Fireball,
  "intellect fortress": IntellectFortress,
  "lightning bolt": LightningBolt,
  "mass healing word": MassHealingWord,
  "meld into stone": MeldIntoStone,
  "Melf's minute meteors": MelfsMinuteMeteors,
  "sleet storm": SleetStorm,
  slow: Slow,
  "spirit guardians": SpiritGuardians,
  "wall of water": WallOfWater,
  "water breathing": WaterBreathing,
  "water walk": WaterWalk,

  "charm monster": CharmMonster,
  "control water": ControlWater,
  "fire shield": FireShield,
  "freedom of movement": FreedomOfMovement,
  "guardian of nature": GuardianOfNature,
  "ice storm": IceStorm,
  stoneskin: Stoneskin,
  "wall of fire": WallOfFire,

  "commune with nature": CommuneWithNature,
  "cone of cold": ConeOfCold,
  "conjure elemental": ConjureElemental,

  "meteor swarm": MeteorSwarm,
} as const;
export default allSpells;

export type SpellName = keyof typeof allSpells;
