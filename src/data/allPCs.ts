import Aura from "../pcs/davies/Aura";
import Beldalynn from "../pcs/davies/Beldalynn";
import Galilea from "../pcs/davies/Galilea";
import Hagrond from "../pcs/davies/Hagrond";
import Salgar from "../pcs/davies/Salgar";
import Esles from "../pcs/glean/Es'les";
import Faerfarn from "../pcs/glean/Faerfarn";
import Litt from "../pcs/glean/Litt";
import Marvoril from "../pcs/glean/Marvoril";
import Shaira from "../pcs/glean/Shaira";
import Tethilssethanar from "../pcs/wizards/Tethilssethanar";

const allPCs = {
  Aura,
  Beldalynn,
  Galilea,
  Hagrond,
  Salgar,

  Tethilssethanar,

  "Es'les": Esles,
  Faerfarn,
  Litt,
  Marvoril,
  Shaira,
} as const;
export default allPCs;

export type PCName = keyof typeof allPCs;
