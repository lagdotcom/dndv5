import PCBackground from "../types/PCBackground";
import { GamingSets } from "../types/ToolName";
import { gains } from "../utils/gain";

const Soldier: PCBackground = {
  name: "Soldier",
  description: `War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield. You might have been part of a standing national army or a mercenary company, or perhaps a member of a local militia who rose to prominence during a recent war.

  When you choose this background, work with your DM to determine which military organization you were a part of, how far through its ranks you progressed, and what kind of experiences you had during your military career. Was it a standing army, a town guard, or a village militia? Or it might have been a noble's or merchant's private army, or a mercenary company.`,
  feature: {
    name: "Military Rank",
    description: `You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized.`,
  },
  skills: gains(["Athletics", "Intimidation"]),
  tools: gains(["vehicles (land)"], 1, GamingSets),
};
export default Soldier;
