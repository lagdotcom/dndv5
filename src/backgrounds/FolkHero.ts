import PCBackground from "../types/PCBackground";
import { ArtisansTools } from "../types/ToolName";
import { gains } from "../utils/gain";

const FolkHero: PCBackground = {
  name: "Folk Hero",
  description: `You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere.`,
  feature: {
    name: "Rustic Hospitality",
    description: `Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.`,
  },
  skills: gains(["Animal Handling", "Survival"]),
  tools: gains(["vehicles (land)"], 1, ArtisansTools),
};
export default FolkHero;
