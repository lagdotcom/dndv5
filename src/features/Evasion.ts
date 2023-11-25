import SimpleFeature from "./SimpleFeature";

const Evasion = new SimpleFeature(
  "Evasion",
  `Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.`,
  (g, me) => {
    g.events.on(
      "BeforeSave",
      ({
        detail: { who, ability, failDamageResponse, saveDamageResponse },
      }) => {
        if (
          who === me &&
          ability === "dex" &&
          saveDamageResponse.fallback === "half"
        ) {
          failDamageResponse.add("half", Evasion);
          saveDamageResponse.add("zero", Evasion);
        }
      },
    );
  },
);
export default Evasion;
