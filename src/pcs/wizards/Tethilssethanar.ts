import Engine from "../../Engine";
import PC from "../../PC";
import Triton from "../../races/Triton";

export default class Tethilssethanar extends PC {
  constructor(g: Engine) {
    super(
      g,
      "Tethilssethanar",
      "https://www.dndbeyond.com/avatars/22548/562/1581111423-64025171.jpeg"
    );

    this.setRace(Triton);
  }
}
