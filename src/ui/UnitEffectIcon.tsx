import unknownIconUrl from "./icons/missing-icon.svg";
import SVGIcon from "./SVGIcon";
import { UnitEffect } from "./utils/types";

interface Props {
  effect: UnitEffect;
}

export default function UnitEffectIcon({ effect }: Props) {
  // TODO show duration

  return (
    <div title={effect.name}>
      <SVGIcon src={effect.icon ?? unknownIconUrl} size={25} />
    </div>
  );
}
