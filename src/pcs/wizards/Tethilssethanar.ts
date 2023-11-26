import tokenUrl from "@img/tok/pc/tethilssethanar.png";

import Monk from "../../classes/monk";
import Engine from "../../Engine";
import { SlingBullet } from "../../items/ammunition";
import { Dart, Sickle, Sling } from "../../items/weapons";
import PC from "../../PC";
import Triton from "../../races/Triton";

export default class Tethilssethanar extends PC {
  constructor(g: Engine) {
    super(g, "Tethilssethanar", tokenUrl);

    this.setAbilityScores(9, 14, 13, 8, 15, 13);
    this.setRace(Triton);
    this.addClassLevel(Monk);
    this.addProficiency("Athletics", "proficient");
    this.addProficiency("Insight", "proficient");

    this.don(new Sickle(g));
    this.don(new Dart(g, 10));
    this.inventory.add(new Sling(g));
    this.inventory.add(new SlingBullet(g, 40));
  }
}
