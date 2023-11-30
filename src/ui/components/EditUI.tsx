import { StateUpdater, useEffect } from "preact/hooks";

import BattleTemplate, {
  initialiseFromTemplate,
} from "../../data/BattleTemplate";
import Engine from "../../Engine";
import { enumerate } from "../../utils/numbers";
import {
  allCombatants,
  resetAllState,
  showSideHP,
  showSideUnderlay,
} from "../utils/state";
import { getUnitData } from "../utils/types";
import Battlefield from "./Battlefield";

interface EditUIProps {
  g: Engine;
  template: BattleTemplate;
  onUpdate: StateUpdater<BattleTemplate>;
}

export default function EditUI({ g, template }: EditUIProps) {
  useEffect(() => {
    void initialiseFromTemplate(g, template).then((arg) => {
      resetAllState();
      allCombatants.value = Array.from(g.combatants, getUnitData);
      showSideHP.value = enumerate(0, 9);
      showSideUnderlay.value = true;
      return arg;
    });

    return g.reset.bind(g);
  }, [g, template]);

  return (
    <>
      <Battlefield showHoveredTile />
    </>
  );
}
