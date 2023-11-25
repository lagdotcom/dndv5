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
    this.skills.set("Athletics", 1);
    this.skills.set("Insight", 1);

    this.don(new Sickle(g));
    this.inventory.add(new Dart(g, 10));
    this.inventory.add(new Sling(g));
    this.inventory.add(new SlingBullet(g, 40));
  }
}
