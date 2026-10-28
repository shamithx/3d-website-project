import type { AnimalKind, MoralCategory, Story } from "./types";
import { sasaJataka } from "./sasa";

const PTS_NOTE = {
  en: "Summarised from the Pali commentarial tradition. Regional Sri Lankan retellings sometimes differ in detail; this page is an educational summary, not a canonical translation.",
  si: "පාලි අටුවා සම්ප්‍රදාය ඇසුරින් සාරාංශ කර ඇත. ශ්‍රී ලංකාවේ ප්‍රාදේශීය පුනර්කථනවල විස්තර වෙනස් විය හැක. මෙය අධ්‍යාපනික සාරාංශයක් මිස කැනොනික පරිවර්තනයක් නොවේ.",
};

const attribution = (volume: string, translators: string) =>
  `${translators}, The Jātaka, Vol. ${volume} (Pali Text Society, public domain)`;

export const vessantaraJataka: Story = {
  id: "vessantara",
  slug: "vessantara-jataka",
  title: { en: "Vessantara Jataka", si: "වෙස්සන්තර ජාතකය" },
  tagline: { en: "The prince who gave everything", si: "සියල්ල දන් දුන් කුමරු" },
  summary: {
    en: "Prince Vessantara gives away the kingdom’s rain-bringing white elephant, then his wealth, his children and finally his wife. He does not do it because he loves them less, but because he has promised to hold nothing back.",
    si: "වෙස්සන්තර කුමරු රාජ්‍යයට වැසි ගෙන දෙන සුදු ඇතා, පසුව තම ධනය, දරුවන් සහ අවසානයේ බිරිඳ පවා දන් දෙයි. ඔහු ඔවුන්ට ආදරය නොකළ නිසා නොව, කිසිවක් රඳවා නොගන්නා බවට දුන් පොරොන්දුව නිසාය.",
  },
  moral: {
    en: "True generosity gives what is precious, not only what is spare.",
    si: "සැබෑ දානය යනු අතිරික්තය පමණක් නොව, වටිනාම දෙයද අත්හැරීමයි.",
  },
  moralCategories: ["generosity", "patience", "courage"],
  ageRange: [11, 15],
  minutes: 14,
  difficulty: "rich",
  languages: ["en", "si"],
  animal: "elephant",
  scene: "palace",
  palette: "gold",
  composition: "wide",
  featured: true,
  source: {
    collection: "Jātaka, Book 22 (Mahā-nipāta)",
    jatakaNumber: 547,
    attribution: attribution("VI", "E. B. Cowell & W. H. D. Rouse"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "Vessantara gives the white elephant to a neighbouring kingdom that asks for rain. The people, fearing drought, demand his exile.",
      si: "වැසි ඉල්ලා පැමිණි අසල්වැසි රාජ්‍යයකට වෙස්සන්තර සුදු ඇතා දන් දෙයි. නියඟයට බිය වූ වැසියෝ ඔහුට රාජ්‍යයෙන් පිටව යන ලෙස ඉල්ලා සිටිති.",
    },
    {
      en: "In exile he gives away his children and his wife to a brahmin, and is finally reunited when Sakka returns them — a story about the cost of an unconditional promise.",
      si: "ගමන් කරන අතරේ ඔහු තම දරුවන් සහ බිරිඳ බමුණෙකුට දන් දෙයි. අවසානයේ සක්දෙවිඳු ඔවුන් නැවත භාර දෙයි — කොන්දේසි විරහිත පොරොන්දුවක මිල ගැන කතාවකි.",
    },
  ],
  characters: [
    { name: { en: "Vessantara", si: "වෙස්සන්තර" }, role: { en: "The Bodhisatta, a prince devoted to giving.", si: "දානයට කැප වූ කුමරු, බෝධිසත්වයන්." } },
    { name: { en: "Maddī", si: "මද්දී" }, role: { en: "His wife, who shares his resolve.", si: "ඔහුගේ අධිෂ්ඨානය බෙදාගන්නා බිරිඳ." } },
    { name: { en: "Jāli and Kaṇhājinā", si: "ජාලි සහ කණ්හාජිනා" }, role: { en: "Their two children.", si: "ඔවුන්ගේ දරුවන් දෙදෙනා." } },
  ],
};

const nigrodhamigaJataka: Story = {
  id: "nigrodhamiga",
  slug: "nigrodhamiga-jataka",
  title: { en: "Nigrodhamiga Jataka", si: "නිග්‍රෝධමිග ජාතකය" },
  tagline: { en: "The deer who took another’s place", si: "අනුන් වෙනුවට ගිය මුවා" },
  summary: {
    en: "Two deer herds live in terror of a king who hunts them daily. Their leaders agree that one deer will be taken each day by lot — until the Banyan Deer steps forward to die in place of a pregnant doe.",
    si: "දිනපතා දඩයම් කරන රජු නිසා මුව රැළි දෙකක් භයින් ජීවත් වෙති. දිනකට එක් මුවෙකු ගොදුරු වන ලෙස රැළි දෙකේ නායකයෝ එකඟ වෙති. ගැබිනි මුව දෙනක වෙනුවට මිය යාමට ඉදිරිපත් වන්නේ නිග්‍රෝධ මුව රජුය.",
  },
  moral: {
    en: "A leader’s courage is measured by whom they are willing to stand in for.",
    si: "නායකයෙකුගේ ධෛර්යය මනින්නේ ඔහු කා වෙනුවට ඉදිරිපත් වන්නේද යන්නෙනි.",
  },
  moralCategories: ["leadership", "compassion", "courage"],
  ageRange: [9, 13],
  minutes: 8,
  difficulty: "balanced",
  languages: ["en", "si"],
  animal: "deer",
  scene: "forest",
  palette: "emerald",
  composition: "arch",
  featured: true,
  source: {
    collection: "Jātaka, Book 1 (Eka-Nipāta)",
    jatakaNumber: 12,
    attribution: attribution("I", "Robert Chalmers"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "The king’s daily hunt terrifies the deer. The two herd leaders arrange a daily lottery so only one deer is killed each day.",
      si: "රජුගේ දිනපතා දඩයම නිසා මුවෝ තැති ගනිති. දිනකට එක් මුවෙකු පමණක් මිය යන ලෙස රැළි දෙකේ නායකයෝ දිනපතා ගොනුවක් සකස් කරති.",
    },
    {
      en: "When the lot falls on a pregnant doe, the Banyan Deer offers his own life. The king, ashamed, grants safety to every deer in the forest.",
      si: "ගොනුව ගැබිනි මුව දෙනකට වැටෙන විට නිග්‍රෝධ මුව රජු තම ජීවිතය පිළිගන්වයි. ලජ්ජාවට පත් රජු වනයේ සියලු මුවන්ට ආරක්ෂාව දෙයි.",
    },
  ],
  characters: [
    { name: { en: "The Banyan Deer", si: "නිග්‍රෝධ මුවා" }, role: { en: "The Bodhisatta and leader of one herd.", si: "බෝධිසත්වයන් සහ එක් රැළක නායකයා." } },
    { name: { en: "The King", si: "රජු" }, role: { en: "A hunter who is changed by another’s sacrifice.", si: "අනුන්ගේ කැපකිරීමෙන් වෙනස් වන දඩයම්කරුවා." } },
  ],
};

const mahakapiJataka: Story = {
  id: "mahakapi",
  slug: "mahakapi-jataka",
  title: { en: "Mahakapi Jataka", si: "මහාකපි ජාතකය" },
  tagline: { en: "The bridge made of a body", si: "සිරුරෙන් තැනූ පාලම" },
  summary: {
    en: "A monkey king discovers a fruit tree across a river and leads his herd to it. When the king of Benares claims the tree, the monkeys are trapped — and their leader stretches his own body across the water to make a bridge for them.",
    si: "වඳුරු රජෙක් ගඟක් අවට පලතුරු ගසක් සොයාගෙන තම රැළ එහි රැගෙන යයි. බරණැස් රජු ගස තමන්ට අයත් යැයි කියන විට වඳුරෝ අතරමං වෙති. ඔවුන් වෙනුවෙන් වඳුරු රජු තම සිරුර ගඟ හරහා පාලමක් ලෙස දිගු කරයි.",
  },
  moral: {
    en: "Leadership means carrying others before yourself.",
    si: "නායකත්වය යනු තමන්ට පෙර අනුන් උසුලා ගැනීමයි.",
  },
  moralCategories: ["leadership", "courage", "compassion"],
  ageRange: [10, 14],
  minutes: 9,
  difficulty: "balanced",
  languages: ["en", "si"],
  animal: "monkey",
  scene: "cliff",
  palette: "emerald",
  composition: "wide",
  featured: false,
  source: {
    collection: "Jātaka, Book 16 (Tiṃsa-Nipāta)",
    jatakaNumber: 407,
    attribution: attribution("III", "H. T. Francis & R. A. Neil"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "The monkey king finds a mango tree by the river and brings his herd across on a bamboo bridge of vines.",
      si: "වඳුරු රජු ගඟ අද්දර අඹ ගසක් සොයාගෙන, වැල්වලින් තැනූ පාලමක් හරහා තම රැළ එතැනට රැගෙන යයි.",
    },
    {
      en: "Trapped by the king’s archers, he spans the water with his own body so the herd can cross, and dies content that they are safe.",
      si: "රජුගේ ඊතල දුනුකරුවන් අතර සිරවූ ඔහු, රැළට තරණය කළ හැකි වන පිණිස තම සිරුරෙන් ගඟ හරහා පාලමක් තනයි. ඔවුන් ආරක්ෂිත බව දැනගෙන ඔහු සතුටින් මිය යයි.",
    },
  ],
  characters: [
    { name: { en: "The Monkey King", si: "වඳුරු රජු" }, role: { en: "The Bodhisatta, who puts his herd before himself.", si: "රැළට තමන්ට වඩා තැන දෙන බෝධිසත්වයන්." } },
    { name: { en: "The King of Benares", si: "බරණැස් රජු" }, role: { en: "Witness to a sacrifice he did not expect.", si: "අපේක්ෂා නොකළ කැපකිරීමක සාක්ෂිකරු." } },
  ],
};

const kapiJataka: Story = {
  id: "kapi",
  slug: "kapi-jataka",
  title: { en: "Kapi Jataka", si: "කපි ජාතකය" },
  tagline: { en: "The warning half the troop ignored", si: "අඩක් නොසලකා හැරි අවවාදය" },
  summary: {
    en: "When a careless monkey insults the king’s chaplain, the monkey leader sees danger coming and tells his troop to leave the royal park. Half of them listen. The other half stay — and learn why a wise warning is worth more than a comfortable home.",
    si: "නොසැලකිලිමත් වඳුරෙක් රජුගේ පුරෝහිතයාට අවමානයක් කරන විට, වඳුරු නායකයා එන අනතුර දැක රැළට රජුගේ උද්‍යානයෙන් පිටව යන ලෙස කියයි. අඩක් ඔහුට සවන් දෙති. අනෙක් අඩක් රැඳී සිට, ප්‍රඥාවන්ත අවවාදයක් සැපපහසු නිවසකට වඩා වටින්නේ ඇයිදැයි ඉගෙන ගනිති.",
  },
  moral: {
    en: "Wisdom includes knowing when to walk away.",
    si: "ප්‍රඥාව යනු කවදා ඉවත් විය යුතුදැයි දැනගැනීමද වේ.",
  },
  moralCategories: ["wisdom", "problem-solving", "patience"],
  ageRange: [9, 13],
  minutes: 7,
  difficulty: "balanced",
  languages: ["en", "si"],
  animal: "monkey",
  scene: "garden",
  palette: "dusk",
  composition: "column",
  featured: false,
  source: {
    collection: "Jātaka, Book 15 (Tiṃsa-Nipāta)",
    jatakaNumber: 404,
    attribution: attribution("III", "H. T. Francis & R. A. Neil"),
    note: {
      en: "This retelling stops before the story’s violent later episodes, which are unsuitable for younger readers. The teaching on prudent advice is kept intact.",
      si: "මෙම පුනර්කථනය කතාවේ පසුව එන හිංසන සිදුවීම්වලට පෙර නතර වේ; ඒවා කුඩා දරුවන්ට සුදුසු නොවේ. ප්‍රඥාවන්ත අවවාදය පිළිබඳ ඉගැන්වීම එලෙසම රඳවා ඇත.",
    },
  },
  beats: [
    {
      en: "A monkey’s prank humiliates the chaplain, who quietly plans revenge on every monkey in the park.",
      si: "වඳුරෙකුගේ විහිළුවක් පුරෝහිතයාට අවමානයක් වන අතර, ඔහු උද්‍යානයේ සියලු වඳුරන්ට පළිගැනීමට සැලසුම් කරයි.",
    },
    {
      en: "The leader warns the troop and leads half of them into the forest. The others choose comfort over counsel.",
      si: "නායකයා රැළට අවවාද කර අඩක් වනාන්තරයට රැගෙන යයි. අනෙක් අය සැපපහසුව තෝරා ගනිති.",
    },
  ],
};

const nalapanaJataka: Story = {
  id: "nalapana",
  slug: "nalapana-jataka",
  title: { en: "Nalapana Jataka", si: "නළපාන ජාතකය" },
  tagline: { en: "Drinking through a reed", si: "බටයකින් ජලය බීම" },
  summary: {
    en: "A monkey king notices that the footprints at a strange lake all lead in and none lead out. Instead of forbidding the water, he finds a way to drink from it safely — and teaches his whole troop to do the same.",
    si: "වඳුරු රජෙක් අමුතු විලක් අද්දර පා සටහන් සියල්ල ජලයට යන නමුත් එකක්වත් එළියට නොඑන බව දකියි. ජලය තහනම් කරනවා වෙනුවට ඔහු ආරක්ෂිතව එයින් බීමට මාර්ගයක් සොයාගෙන මුළු රැළටම එය උගන්වයි.",
  },
  moral: {
    en: "A clever solution is better than a fearful refusal.",
    si: "භයෙන් ප්‍රතික්ෂේප කිරීමට වඩා බුද්ධිමත් විසඳුමක් උතුම්ය.",
  },
  moralCategories: ["problem-solving", "wisdom", "leadership"],
  ageRange: [8, 12],
  minutes: 6,
  difficulty: "gentle",
  languages: ["en", "si"],
  animal: "monkey",
  scene: "lake",
  palette: "river",
  composition: "arch",
  featured: false,
  source: {
    collection: "Jātaka, Book 1 (Eka-Nipāta)",
    jatakaNumber: 20,
    attribution: attribution("I", "Robert Chalmers"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "The troop waits at an unfamiliar lake because their king taught them never to eat or drink anything new without asking him first.",
      si: "රැළ අමුතු විලක් අද්දර රැඳී සිටියි; අලුත් දෙයක් ගැනීමට පෙර තම රජුගෙන් අසන ලෙස ඔහු ඔවුන්ට උගන්වා තිබුණි.",
    },
    {
      en: "He reads the one-way footprints, guesses an ogre waits below, and has the monkeys drink through hollow reeds from the bank.",
      si: "ඔහු එක් දිශාවකට පමණක් යන පා සටහන් දැක, ජලයේ රාක්ෂයෙක් සිටින බව අනුමාන කර, බට හිස් කඳන් මගින් ඉවුරේ සිට ජලය බීමට රැළට උපදෙස් දෙයි.",
    },
  ],
};

const ruruJataka: Story = {
  id: "ruru",
  slug: "ruru-jataka",
  title: { en: "Ruru Jataka", si: "රුරු ජාතකය" },
  tagline: { en: "The deer who saved the man who betrayed him", si: "තමන්ට ද්‍රෝහී වූ මිනිසා බේරාගත් මුවා" },
  summary: {
    en: "A golden deer rescues a man from drowning and asks only that he tell no one. The man, tempted by a royal reward, breaks his promise — and finds that the truth cannot be bought.",
    si: "රන්වන් මුවෙක් ගිලෙමින් සිටි මිනිසෙකු බේරාගෙන, කිසිවෙකුට නොකියන ලෙස පමණක් ඉල්ලයි. රාජකීය ත්‍යාගයක ඇදීමට පත් මිනිසා තම පොරොන්දුව කඩයි — සත්‍යය මුදලට ගත නොහැකි බව ඔහු පසුව දැනගනියි.",
  },
  moral: {
    en: "Gratitude is proved in what you refuse to do, not only in what you say.",
    si: "කෘතඥතාව ඔබ කියන දෙයින් පමණක් නොව, ඔබ කිරීමට ප්‍රතික්ෂේප කරන දෙයින්ද පෙනේ.",
  },
  moralCategories: ["honesty", "kindness", "compassion"],
  ageRange: [9, 13],
  minutes: 8,
  difficulty: "balanced",
  languages: ["en", "si"],
  animal: "deer",
  scene: "river",
  palette: "gold",
  composition: "wide",
  featured: false,
  source: {
    collection: "Jātaka, Book 18 (Duka-Nipāta)",
    jatakaNumber: 482,
    attribution: attribution("IV", "W. H. D. Rouse"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "The deer hears a cry from the river and pulls a drowning man to the bank, asking only for silence.",
      si: "මුවා ගඟින් ඇසෙන හඬක් අසා ගිලෙමින් සිටි මිනිසෙකු ඉවුරට ඇද දමයි; ඉල්ලන්නේ නිහඬව සිටීම පමණි.",
    },
    {
      en: "The man tells the king where the golden deer lives. Before the king’s arrow flies, the deer speaks, and the betrayal is exposed.",
      si: "මිනිසා රජුට රන්වන් මුවා සිටින තැන කියයි. රජුගේ ඊතලය පිටත් වීමට පෙර මුවා කතා කරන අතර ද්‍රෝහියා හෙළිදරව් වේ.",
    },
  ],
};

const kuruDhammaJataka: Story = {
  id: "kuru-dhamma",
  slug: "kuru-dhamma-jataka",
  title: { en: "Kuru Dhamma Jataka", si: "කුරු ධර්ම ජාතකය" },
  tagline: { en: "When a whole kingdom kept its word", si: "මුළු රාජ්‍යයක් වචනය රැකි විට" },
  summary: {
    en: "A drought falls on the Kuru kingdom. The king and his people refuse to abandon the five virtues even to save the harvest — and the rain, the old story says, comes not from a bargain but from the way they lived.",
    si: "කුරු රාජ්‍යයට නියඟයක් පැමිණේ. අස්වැන්න බේරා ගැනීම පිණිසවත් රජු සහ ඔහුගේ ජනතාව පංචසීලය අත් නොහරිති. පැරණි කතාව කියන පරිදි වැස්ස පැමිණෙන්නේ ගනුදෙනුවකින් නොව, ඔවුන් ජීවත් වූ ආකාරයෙනි.",
  },
  moral: {
    en: "Ethical life is not a luxury to be set aside when times are hard.",
    si: "සදාචාරාත්මක ජීවිතය අපහසු කාලවලදී පසෙක තැබිය යුතු සුඛෝපභෝගී දෙයක් නොවේ.",
  },
  moralCategories: ["honesty", "leadership", "patience"],
  ageRange: [10, 14],
  minutes: 8,
  difficulty: "balanced",
  languages: ["en", "si"],
  animal: "human",
  scene: "village",
  palette: "river",
  composition: "arch",
  featured: false,
  source: {
    collection: "Jātaka, Book 3 (Tika-Nipāta)",
    jatakaNumber: 276,
    attribution: attribution("II", "W. H. D. Rouse"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "With the rains failing, the people of Kuru keep the five virtues rather than break them under pressure.",
      si: "වැසි නොලැබීම නිසා කුරු රාජ්‍යයේ ජනතාව පීඩනය යටතේ පංචසීලය කඩන්නේ නැතිව එය රැක ගනී.",
    },
    {
      en: "The story links the return of rain to that shared discipline — a traditional way of saying that a community’s character shapes its fortune.",
      si: "වැස්ස නැවත පැමිණීම එම පොදු විනයට සම්බන්ධ කරයි — ප්‍රජාවක චරිතය එහි වාසනාව හඩගස්වයි යන සම්ප්‍රදායික අදහසයි.",
    },
  ],
};

const mahajanakaJataka: Story = {
  id: "mahajanaka",
  slug: "mahajanaka-jataka",
  title: { en: "Mahajanaka Jataka", si: "මහාජනක ජාතකය" },
  tagline: { en: "Seven days in the sea", si: "මුහුදේ දින හතක්" },
  summary: {
    en: "A prince survives a shipwreck by swimming for seven days without giving up. Rescued, he wins back his kingdom — and then discovers that the harder question is what to do with it.",
    si: "කුමරෙක් නැව බිඳී ගිලෙන අතර දින හතක් පසුබට නොවී පිහිනයි. බේරා ගන්නා ඔහු තම රාජ්‍යය නැවත දිනා ගනියි — පසුව දැනගන්නේ ඊට වඩා අපහසු ප්‍රශ්නය එයින් කුමක් කළ යුතුද යන්න බවය."
  },
  moral: {
    en: "Perseverance opens the door; wisdom decides what to do once it is open.",
    si: "අධිෂ්ඨානය දොර විවෘත කරයි; දොර හැරුණු පසු කුමක් කළ යුතුද යන්න තීරණය කරන්නේ ප්‍රඥාවයි.",
  },
  moralCategories: ["courage", "patience", "wisdom"],
  ageRange: [11, 15],
  minutes: 12,
  difficulty: "rich",
  languages: ["en", "si"],
  animal: "fish",
  scene: "ocean",
  palette: "dusk",
  composition: "wide",
  featured: false,
  source: {
    collection: "Jātaka, Book 22 (Mahā-nipāta)",
    jatakaNumber: 539,
    attribution: attribution("VI", "E. B. Cowell & W. H. D. Rouse"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "Shipwrecked, Mahajanaka refuses to surrender to the sea and keeps swimming until a goddess lifts him out.",
      si: "නැව බිඳී ගිය මහාජනක මුහුදට යටත් නොවී පිහිනමින් සිටියි. අවසානයේ දෙවඟනක් ඔහු එළියට ගනී.",
    },
    {
      en: "He recovers his father’s kingdom, rules well, and later leaves it to seek something the throne cannot give.",
      si: "ඔහු තම පියාගේ රාජ්‍යය නැවත ලබාගෙන යහපත් ලෙස පාලනය කරයි. පසුව සිංහාසනයට දිය නොහැකි දෙයක් සොයා එයින් නික්ම යයි.",
    },
  ],
};

const temiyaJataka: Story = {
  id: "temiya",
  slug: "temiya-jataka",
  title: { en: "Temiya Jataka", si: "තේමිය ජාතකය" },
  tagline: { en: "The prince who would not speak", si: "නොකතා කළ කුමරු" },
  summary: {
    en: "A prince remembers a past life as a king and the suffering that came with it. To avoid the throne he pretends to be mute and helpless for sixteen years, until a royal test forces him to speak.",
    si: "කුමරෙක් පෙර ආත්මයක රජෙකුව සිට එයින් ලද දුක් සිහිපත් කරයි. සිංහාසනයෙන් මිදීමට ඔහු වසර දහසයක් ගොළු සහ අසරණ ලෙස පෙනී සිටියි. රාජකීය පරීක්ෂාවක් ඔහුට කතා කිරීමට සලස්වයි.",
  },
  moral: {
    en: "Courage can look like refusing what everyone expects you to want.",
    si: "සැමෝම ඔබට අවශ්‍ය යැයි සිතන දෙය ප්‍රතික්ෂේප කිරීමද ධෛර්යයකි.",
  },
  moralCategories: ["courage", "wisdom", "patience"],
  ageRange: [10, 14],
  minutes: 11,
  difficulty: "rich",
  languages: ["en", "si"],
  animal: "human",
  scene: "garden",
  palette: "night",
  composition: "column",
  featured: false,
  source: {
    collection: "Jātaka, Book 22 (Mahā-nipāta)",
    jatakaNumber: 538,
    attribution: attribution("VI", "E. B. Cowell & W. H. D. Rouse"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "Temiya recalls a former life as a king and the remorse that followed his rule, and chooses silence over the throne.",
      si: "තේමිය පෙර ආත්මයේ රජෙකු ලෙස ගත කළ ජීවිතය සහ පාලනයෙන් පසු ඇති වූ පසුතැවීම සිහිපත් කර, සිංහාසනයට වඩා නිහඬතාව තෝරා ගනියි.",
    },
    {
      en: "His father orders increasingly severe tests. At the last, Temiya speaks, and asks for permission to leave the palace and seek freedom.",
      si: "පිය රජු වඩාත් දැඩි පරීක්ෂණ නියෝග කරයි. අවසාන පරීක්ෂාවේදී තේමිය කතා කර, මාලිගයෙන් පිටව ගොස් නිදහස සොයා ගැනීමට අවසර ඉල්ලයි.",
    },
  ],
};

const suvannasamaJataka: Story = {
  id: "suvannasama",
  slug: "suvannasama-jataka",
  title: { en: "Suvannasama Jataka", si: "සුවණ්ණසාම ජාතකය" },
  tagline: { en: "The son who carried his parents", si: "දෙමාපියන් උසුලාගත් පුතා" },
  summary: {
    en: "Suvannasama takes his blind parents into the forest and cares for them alone. When a king’s arrow strikes him by mistake, his only worry is who will look after them — and the truth of that love becomes the story’s miracle.",
    si: "සුවණ්ණසාම තම අන්ධ දෙමාපියන් වනාන්තරයට රැගෙන ගොස් තනිවම රැකබලා ගනියි. රජුගේ ඊතලය වැරදීමකින් ඔහුට වැදුණු විට ඔහුගේ එකම කනස්සල්ල ඔවුන් රැකබලා ගන්නේ කවුද යන්නය. ඒ ආදරයේ සත්‍යය කතාවේ අද්භූත සිදුවීම බවට පත් වේ.",
  },
  moral: {
    en: "Care for those who raised you is a strength, not a burden.",
    si: "ඔබව හැදූ අය රැකබලා ගැනීම බරක් නොව ශක්තියකි.",
  },
  moralCategories: ["compassion", "patience", "kindness"],
  ageRange: [9, 13],
  minutes: 9,
  difficulty: "balanced",
  languages: ["en", "si"],
  animal: "human",
  scene: "hermitage",
  palette: "emerald",
  composition: "arch",
  featured: false,
  source: {
    collection: "Jātaka, Book 22 (Mahā-nipāta)",
    jatakaNumber: 540,
    attribution: attribution("VI", "E. B. Cowell & W. H. D. Rouse"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "Suvannasama builds a forest home and carries his blind parents to it, fetching water and fruit each day.",
      si: "සුවණ්ණසාම වනයේ නිවසක් තනා තම අන්ධ දෙමාපියන් එහි රැගෙන යයි. දිනපතා ජලය සහ පලතුරු ගෙන එයි.",
    },
    {
      en: "A hunting king mistakes him for an animal. As he lies wounded, he asks only that his parents be cared for.",
      si: "දඩයම් කරන රජෙක් ඔහු සත්වයෙකු යැයි වරදවා තේරුම් ගනියි. තුවාල ලබා වැතිර සිටියදී ඔහු ඉල්ලන්නේ තම දෙමාපියන් රැකබලා ගන්නා ලෙස පමණි.",
    },
  ],
};

const ummaggaJataka: Story = {
  id: "ummagga",
  slug: "ummagga-jataka",
  title: { en: "Ummagga Jataka", si: "උම්මග්ග ජාතකය" },
  tagline: { en: "The tunnel of the wise counsellor", si: "ප්‍රඥාවන්ත අමාත්‍යයාගේ උමං මාර්ගය" },
  summary: {
    en: "Mahosadha, a young counsellor of extraordinary wit, must protect his king from a rival who sends riddles, spies and finally an army. His answers are clever, but the story’s real subject is judgement under pressure.",
    si: "අසාමාන්‍ය බුද්ධියක් ඇති තරුණ අමාත්‍යයෙකු වන මහෝසධ, ප්‍රහේලිකා, ඔත්තුකරුවන් සහ අවසානයේ හමුදාවක් එවන විරුද්ධ රජෙකුගෙන් තම රජු ආරක්ෂා කළ යුතුය. ඔහුගේ පිළිතුරු බුද්ධිමත්ය; නමුත් කතාවේ සැබෑ විෂය පීඩනය යටතේ ගන්නා තීරණයයි.",
  },
  moral: {
    en: "Cleverness earns admiration; good judgement earns trust.",
    si: "දක්ෂතාව ගෞරවය දිනා දේ; යහපත් විනිශ්චය විශ්වාසය දිනා දේ.",
  },
  moralCategories: ["problem-solving", "wisdom", "leadership"],
  ageRange: [11, 15],
  minutes: 13,
  difficulty: "rich",
  languages: ["en", "si"],
  animal: "human",
  scene: "palace",
  palette: "gold",
  composition: "wide",
  featured: false,
  source: {
    collection: "Jātaka, Book 22 (Mahā-nipāta)",
    jatakaNumber: 546,
    attribution: attribution("VI", "E. B. Cowell & W. H. D. Rouse"),
    note: PTS_NOTE,
  },
  beats: [
    {
      en: "As a boy, Mahosadha already settles disputes that adults cannot. His reputation brings him to the king’s court.",
      si: "කුඩා කාලයේම මහෝසධ වැඩිහිටියන්ට විසඳා ගත නොහැකි ආරවුල් විසඳයි. ඔහුගේ කීර්තිය ඔහු රජුගේ මාලිගයට ගෙන එයි.",
    },
    {
      en: "When a rival king attacks, Mahosadha’s planning — including a hidden passage — saves the city without a wasteful battle.",
      si: "විරුද්ධ රජෙක් ආක්‍රමණය කරන විට, සැඟවුණු උමං මාර්ගයක් ඇතුළු මහෝසධගේ සැලසුම් නගරය අනවශ්‍ය යුද්ධයකින් බේරා ගනියි.",
    },
  ],
};

export const stories: readonly Story[] = [
  sasaJataka,
  vessantaraJataka,
  nigrodhamigaJataka,
  mahakapiJataka,
  ruruJataka,
  nalapanaJataka,
  mahajanakaJataka,
  temiyaJataka,
  suvannasamaJataka,
  ummaggaJataka,
  kuruDhammaJataka,
  kapiJataka,
];

export const moralCategories: readonly MoralCategory[] = [
  "kindness",
  "honesty",
  "wisdom",
  "courage",
  "generosity",
  "patience",
  "compassion",
  "leadership",
  "problem-solving",
];

export const featuredStories = stories.filter((story) => story.featured);

export function getStory(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug);
}

export function storiesByCategory(category: MoralCategory): Story[] {
  return stories.filter((story) => story.moralCategories.includes(category));
}

export function categoryCount(category: MoralCategory): number {
  return storiesByCategory(category).length;
}

export type LifeGroup = {
  readonly animal: AnimalKind;
  readonly life: { en: string; si: string };
  readonly stories: readonly Story[];
};

const LIFE_NAMES: Partial<Record<AnimalKind, { en: string; si: string }>> = {
  hare: { en: "Born as a hare", si: "සස ආත්මය" },
  deer: { en: "Born as a deer", si: "මුව ආත්මය" },
  monkey: { en: "Born as a monkey", si: "වඳුරු ආත්මය" },
  elephant: { en: "Born as an elephant", si: "ඇත් ආත්මය" },
  fish: { en: "Born in the sea", si: "මුහුදු ආත්මය" },
  human: { en: "Born as a human", si: "මිනිස් ආත්මය" },
};

export const lives: readonly LifeGroup[] = (["hare", "deer", "monkey", "elephant", "fish", "human"] as AnimalKind[])
  .map((animal) => ({
    animal,
    life: LIFE_NAMES[animal] ?? { en: "A former life", si: "පෙර ආත්මය" },
    stories: stories.filter((story) => story.animal === animal),
  }))
  .filter((group) => group.stories.length > 0);

/** Deterministic "story of the day", drawn only from tales with a full reader. */
export function storyOfTheDay(date = new Date()): Story {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
  const ready = stories.filter((story) => Boolean(story.reader));
  const pool = ready.length > 0 ? ready : [sasaJataka];
  return pool[dayOfYear % pool.length] ?? sasaJataka;
}
