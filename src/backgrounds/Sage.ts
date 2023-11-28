import { LanguageNames } from "../types/LanguageName";
import PCBackground from "../types/PCBackground";
import { gains } from "../utils/gain";

const Sage: PCBackground = {
  name: "Sage",
  description: `You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study.`,
  feature: {
    name: "Researcher",
    description: `When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign.`,
  },
  skills: gains(["Arcana", "History"]),
  languages: gains([], 2, LanguageNames),
};
export default Sage;
