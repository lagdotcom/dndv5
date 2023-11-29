import Acolyte from "../backgrounds/Acolyte";
import Criminal from "../backgrounds/Criminal";
import FolkHero from "../backgrounds/FolkHero";
import Knight from "../backgrounds/Knight";
import Noble from "../backgrounds/Noble";
import Sage from "../backgrounds/Sage";

const allBackgrounds = {
  Acolyte,
  Criminal,
  "Folk Hero": FolkHero,
  Knight,
  Noble,
  Sage,
} as const;
export default allBackgrounds;

export type BackgroundName = keyof typeof allBackgrounds;
