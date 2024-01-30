import { LanguageNames } from "../types/LanguageName";
import PCBackground from "../types/PCBackground";
import { gains } from "../utils/gain";

const Hermit: PCBackground = {
  name: "Hermit",
  description: `You lived in seclusion–either in a sheltered community such as a monastery, or entirely alone–for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for.`,
  feature: {
    name: "Discovery",
    description: `The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society.

    Work with your DM to determine the details of your discovery and its impact on the campaign.`,
  },
  skills: gains(["Medicine", "Religion"]),
  tools: gains(["herbalism kit"]),
  languages: gains([], 1, LanguageNames),
};
export default Hermit;
