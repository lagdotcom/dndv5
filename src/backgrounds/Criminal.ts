import PCBackground from "../types/PCBackground";
import { GamingSets } from "../types/ToolName";
import { gains } from "../utils/gain";

const Criminal: PCBackground = {
  name: "Criminal",
  description: `You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld. You’re far closer than most people to the world of murder, theft, and violence that pervades the underbelly of civilization, and you have survived up to this point by flouting the rules and regulations of society.`,
  feature: {
    name: "Criminal Contact",
    description: `You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.`,
  },
  skills: gains(["Deception", "Stealth"]),
  tools: gains(["thieves' tools"], 1, GamingSets),
};
export default Criminal;
