import Acolyte from "../backgrounds/Acolyte";
import Criminal from "../backgrounds/Criminal";
import FolkHero from "../backgrounds/FolkHero";
import Knight from "../backgrounds/Knight";
import Noble from "../backgrounds/Noble";
import Outlander from "../backgrounds/Outlander";
import Sage from "../backgrounds/Sage";
import Soldier from "../backgrounds/Soldier";

const allBackgrounds = {
  Acolyte,
  Criminal,
  "Folk Hero": FolkHero,
  Knight,
  Noble,
  Outlander,
  Sage,
  Soldier,
} as const;
export default allBackgrounds;

export type BackgroundName = keyof typeof allBackgrounds;
