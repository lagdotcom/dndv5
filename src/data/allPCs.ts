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
import Dandelion from "../pcs/kythera/Dandelion";
import Moya from "../pcs/kythera/Moya";
import Tethilssethanar from "../pcs/wizards/Tethilssethanar";
import PCTemplate from "./PCTemplate";

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

  Dandelion,
  Moya,
} as const;
export default allPCs;

export type PCName = keyof typeof allPCs;

export function injectTestPC(template: PCTemplate): PCName {
  const name = template.name as PCName;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  allPCs[name] = template;
  return name;
}
