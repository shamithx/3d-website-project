import type { Story } from "./types";
import { SASA_SOURCE_ATTRIBUTION, sasaScenes } from "./sasa.scenes";

const SOURCE_URL = "https://suttacentral.net/ja316/en/francis-neil";

export const sasaJataka: Story = {
  id: "sasa",
  slug: "sasa-jataka",
  title: { en: "Sasa Jataka", si: "සස ජාතකය" },
  tagline: {
    en: "The hare who gave everything he had",
    si: "තමන් සතු සියල්ල දන් දුන් සසා",
  },
  summary: {
    en: "On a full-moon day, a small hare with nothing but grass decides that if a beggar comes, he will give his own body. A story about generosity measured by courage, not by size.",
    si: "පොහොය දිනක, තණකොළ හැර වෙනත් කිසිවක් නොමැති කුඩා සසෙක්, යාචකයෙක් පැමිණියොත් තම සිරුරම දන් දෙන බව තීරණය කරයි. ප්‍රමාණයෙන් නොව ධෛර්යයෙන් මනිනු ලබන දානය පිළිබඳ කතාවකි.",
  },
  moral: {
    en: "A gift is measured by the love and courage behind it, not by its size.",
    si: "ත්‍යාගයක වටිනාකම මනින්නේ එහි ප්‍රමාණයෙන් නොව, එය පිටුපස ඇති ආදරය සහ ධෛර්යයෙනි.",
  },
  moralCategories: ["generosity", "compassion", "wisdom", "kindness"],
  ageRange: [8, 12],
  minutes: 7,
  difficulty: "gentle",
  languages: ["en", "si"],
  animal: "hare",
  scene: "forest",
  palette: "dawn",
  composition: "arch",
  featured: true,
  source: {
    collection: "Jātaka, Book 3 (Tika-Nipāta)",
    jatakaNumber: 316,
    attribution: SASA_SOURCE_ATTRIBUTION,
    url: SOURCE_URL,
    note: {
      en: "The frame story and verses are preserved in the Jātaka commentary (Jātakatthavaṇṇanā). The version here is a children’s adaptation, not a canonical translation. The linked 1897 Pali Text Society translation is in the public domain and was used to check every scene.",
      si: "කතාවේ මූලය සහ ගාථා ජාතක අටුවාවේ (ජාතකත්ථවණ්ණනා) සංරක්ෂිතයි. මෙහි දැක්වෙන්නේ ළමුන් සඳහා කරන ලද අනුවර්තනයකි, කැනොනික පරිවර්තනයක් නොවේ. සෑම දර්ශනයක්ම පරීක්ෂා කිරීමට 1897 පාලි තෙක්ස්ට් සොසයිටි පරිවර්තනය භාවිත කර ඇත; එය පොදු වසමේ පවතී.",
    },
  },
  beats: [
    {
      en: "A hare, an otter, a jackal and a monkey live as friends at the edge of a wood. The hare teaches them to give and to keep the precepts.",
      si: "සසෙක්, දියබල්ලෙක්, නරියෙක් සහ වඳුරෙක් වනය අද්දර මිතුරන් ලෙස ජීවත් වෙති. සසා ඔවුන්ට දන් දීම සහ සිල් රැකීම ගැන උගන්වයි.",
    },
    {
      en: "On the fast day the three friends each gather food to give. The hare, who has only grass, resolves to give his own body.",
      si: "පොහොය දිනයේ මිතුරන් තිදෙනා දීමට ආහාර එකතු කරති. තණකොළ පමණක් ඇති සසා තම සිරුරම දන් දීමට තීරණය කරයි.",
    },
    {
      en: "Sakka comes disguised as a hungry brahmin. The fire he makes is cold, and the hare’s giving is remembered in the mark on the moon.",
      si: "සක්දෙවිඳු බඩගිනි බමුණෙකුගේ වේශයෙන් එයි. ඔහු මවන ගින්න සීතලය. සසාගේ දානය හඳේ ලකුණක් ලෙස සදාකාලිකව සිහිපත් වේ.",
    },
  ],
  learning: {
    happened: {
      en: "Four friends keep a fast day together. The otter, jackal and monkey each gather food to offer a stranger. The hare, who has only grass, decides that if someone asks, he will give his own body. Sakka arrives disguised as a brahmin, the fire is lit, and the hare springs onto coals that have no heat in them.",
      si: "මිතුරන් සිව්දෙනෙක් එකට පොහොය දිනක් රකිති. දියබල්ලා, නරියා සහ වඳුරා අමුත්තෙකුට දීමට ආහාර එකතු කරති. තණකොළ පමණක් ඇති සසා, කෙනෙක් ඉල්ලුවොත් තම සිරුර දෙන බව තීරණය කරයි. සක්දෙවිඳු බමුණෙකුගේ වේශයෙන් එයි; ගින්න දැල්වේ; සසා උණුසුමක් නැති අඟුරු මතට පනියි.",
    },
    keyDecision: {
      en: "The hare does not wait to be asked. He works out, in advance, what he actually has to give — and then gives it without bargaining. That is the decision the story turns on: generosity planned before the knock at the door.",
      si: "සසා ඉල්ලීමක් එන තෙක් බලා නොසිටියි. තමන්ට දිය හැක්කේ කුමක්දැයි කලින්ම සිතා, ගනුදෙනුවකින් තොරව එය දෙයි. කතාවේ හැරවුම එයයි: දොරට තට්ටු කිරීමට පෙර සැලසුම් කළ දානය.",
    },
    learned: {
      en: "The three friends learn that giving what is spare is not the same as giving what is precious. Sakka learns that a small creature can hold a resolve that does not depend on reward. The hare himself asks for nothing at all.",
      si: "මිතුරන් තිදෙනා ඉගෙන ගන්නේ අතිරික්තය දීම, වටිනා දෙය දීම නොවන බවයි. සක්දෙවිඳු දැනගන්නේ කුඩා සත්වයෙකුට ත්‍යාගයක් බලාපොරොත්තු නොවන අධිෂ්ඨානයක් තිබිය හැකි බවයි. සසා කිසිවක් ඉල්ලා නොසිටියේය.",
    },
    everyday: {
      en: "Most of us are not asked to give our lives. We are asked for smaller things: a seat, a turn, ten minutes of attention, the last piece of something. The story asks whether those small gifts are prepared in advance — or only offered when they cost us nothing.",
      si: "අපගෙන් බොහෝ දෙනාගෙන් ජීවිතය දන් දෙන ලෙස ඉල්ලා නොසිටී. ඉල්ලන්නේ කුඩා දේය: අසුනක්, වාරයක්, මිනිත්තු දහයක අවධානය, අවසන් කෑල්ල. ඒ කුඩා ත්‍යාග කලින්ම සූදානම්ද, නැතුව පිරිවැයක් නොවන විට පමණක් දෙන දෙයක්ද යන්න කතාව අසයි.",
    },
  },
  characters: [
    {
      name: { en: "The Hare", si: "සසා" },
      role: { en: "The Bodhisatta — the smallest friend, and the teacher of the group.", si: "බෝධිසත්වයන් — කුඩාම මිතුරා, නමුත් කණ්ඩායමේ ගුරුවරයා." },
    },
    {
      name: { en: "The Otter", si: "දියබල්ලා" },
      role: { en: "Finds seven red fish by the river and offers them.", si: "ගඟ අද්දර රතු මාළු හතක් සොයාගෙන ඒවා පිළිගන්වයි." },
    },
    {
      name: { en: "The Jackal", si: "නරියා" },
      role: { en: "Finds a lizard and a jar of curd in a field hut.", si: "කුඹුරු ගෙයක කුඹුරු කටුස්සෙක් සහ කිරි කෝප්පයක් සොයාගනියි." },
    },
    {
      name: { en: "The Monkey", si: "වඳුරා" },
      role: { en: "Gathers ripe mangoes, cool water and shade.", si: "ඉදුණු අඹ, සිසිල් දිය සහ සෙවණ එකතු කරයි." },
    },
    {
      name: { en: "Sakka", si: "සක්දෙවිඳු" },
      role: { en: "King of the gods, who tests the hare in the guise of a brahmin.", si: "දෙවියන්ගේ රජු; බමුණෙකුගේ වේශයෙන් සසා පරීක්ෂා කරයි." },
    },
  ],
  reader: {
    scenes: sasaScenes,
    objectives: [
      {
        en: "Retell the four friends’ fast day in your own words, in the right order.",
        si: "මිතුරන් සිව්දෙනාගේ පොහොය දිනය තම වචනවලින්, නිවැරදි අනුපිළිවෙලට විස්තර කරන්න.",
      },
      {
        en: "Explain why the hare’s gift was different from his friends’ gifts.",
        si: "සසාගේ ත්‍යාගය මිතුරන්ගේ ත්‍යාගවලින් වෙනස් වූයේ ඇයිදැයි පැහැදිලි කරන්න.",
      },
      {
        en: "Find one small act of care in the story and describe what it shows about the character.",
        si: "කතාවේ ඇති කුඩා සැලකිල්ලක් සොයා, එය චරිතය ගැන කුමක් පෙන්වයිදැයි විස්තර කරන්න.",
      },
      {
        en: "Connect the hare’s choice to one ordinary decision you could make this week.",
        si: "සසාගේ තීරණය, මේ සතියේ ඔබට ගත හැකි සාමාන්‍ය තීරණයකට සම්බන්ධ කරන්න.",
      },
    ],
    locations: [
      { id: "wood", name: { en: "The Wood", si: "වනාන්තරය" }, description: { en: "Home of the four friends.", si: "මිතුරන් සිව්දෙනාගේ නිවහන." }, x: 38, y: 58 },
      { id: "mountain", name: { en: "The Mountain", si: "කන්ද" }, description: { en: "The western boundary of the wood.", si: "වනයේ බටහිර මායිම." }, x: 16, y: 26 },
      { id: "river", name: { en: "The River", si: "ගඟ" }, description: { en: "The otter’s hunting ground.", si: "දියබල්ලා ආහාර සොයන තැන." }, x: 64, y: 74 },
      { id: "border-village", name: { en: "Border Village", si: "මායිම් ගම" }, description: { en: "Where the jackal found the field hut.", si: "නරියා කුඹුරු ගෙය සොයාගත් තැන." }, x: 84, y: 42 },
      { id: "clearing", name: { en: "The Clearing", si: "මිදුල" }, description: { en: "Where the fire was kindled.", si: "ගින්න දැල්වූ තැන." }, x: 47, y: 66 },
      { id: "moon", name: { en: "The Moon", si: "හඳ" }, description: { en: "Where the hare’s gift is remembered.", si: "සසාගේ දානය සිහිපත් වන තැන." }, x: 76, y: 12 },
    ],
    reflection: [
      {
        en: "The hare had only grass. What is something small you have that you could share this week?",
        si: "සසා ළඟ තිබුණේ තණකොළ පමණි. මේ සතියේ ඔබට බෙදාගත හැකි කුඩා දෙයක් කුමක්ද?",
      },
      {
        en: "Why do you think the hare shook himself three times before jumping?",
        si: "සසා පැනීමට පෙර තෙවරක් සිරුර සොලවා ගත්තේ ඇයි කියා ඔබ සිතන්නේ?",
      },
      {
        en: "Which of the four friends did you learn the most from? Give a reason.",
        si: "මිතුරන් සිව්දෙනාගෙන් ඔබ වඩාත් යමක් ඉගෙන ගත්තේ කාගෙන්ද? හේතුවක් දෙන්න.",
      },
    ],
    vocabulary: [
      {
        word: "දානය",
        transliteration: "dānaya",
        meaningSi: "දීම; අන් අයට පිරිසිදු සිතින් දෙන දෙය.",
        meaningEn: "Giving; a gift offered with a clear heart.",
        exampleSi: "සසා තම සිරුර දානය කරන්නට සූදානම් විය.",
        exampleEn: "The hare prepared to make a gift of his own body.",
      },
      {
        word: "සීලය",
        transliteration: "sīlaya",
        meaningSi: "යහපත් හැසිරීම; සිල් රැකීම.",
        meaningEn: "Virtue; the practice of keeping moral precepts.",
        exampleSi: "මිතුරන් සිව්දෙනා පොහොය දිනයේ සීලය රැක්කහ.",
        exampleEn: "The four friends kept the precepts on the fast day.",
      },
      {
        word: "පොහොය",
        transliteration: "pohoya",
        meaningSi: "පූර්ණ චන්ද්‍රයා ඇති දිනය; සිල් රැකීමට වෙන් කරන දිනය.",
        meaningEn: "Full-moon day, observed by keeping precepts.",
        exampleSi: "හෙට පොහොය දිනයකි.",
        exampleEn: "Tomorrow is a full-moon day.",
      },
      {
        word: "බෝධිසත්ව",
        transliteration: "bōdhisattva",
        meaningSi: "බුදුබව පිණිස කුසල් රැස් කරන මහා කරුණාවන්ත චරිතය.",
        meaningEn: "A being on the path to awakening; here, the Buddha in a former life.",
        exampleSi: "මෙම කතාවේ බෝධිසත්වයන් සසෙකු ලෙස උපත ලැබීය.",
        exampleEn: "In this story the Bodhisatta was born as a hare.",
      },
      {
        word: "තාපස",
        transliteration: "tāpasa",
        meaningSi: "සරල ජීවිතයක් ගත කරන ආගමික සන්‍යාසියෙක්.",
        meaningEn: "An ascetic; someone who lives a simple religious life.",
        exampleSi: "බමුණා තාපසයෙකු සේ පෙනී සිටියේය.",
        exampleEn: "The brahmin appeared as an ascetic.",
      },
      {
        word: "කරුණාව",
        transliteration: "karuṇāva",
        meaningSi: "අනුන්ගේ දුකට දක්වන දයාව.",
        meaningEn: "Compassion; tenderness for another’s suffering.",
        exampleSi: "තම ලොම් අතර සිටින සතුන් ගැන සසාට කරුණාව ඇති විය.",
        exampleEn: "The hare felt compassion for the insects in his fur.",
      },
      {
        word: "අධිෂ්ඨානය",
        transliteration: "adhiṣṭhānaya",
        meaningSi: "අත් නොහරින දැඩි තීරණය.",
        meaningEn: "A firm resolve that is not given up.",
        exampleSi: "සසාගේ අධිෂ්ඨානය ගින්නෙන් පවා නොනැවතුණි.",
        exampleEn: "The hare’s resolve was not stopped even by fire.",
      },
      {
        word: "චන්ද්‍රයා",
        transliteration: "chandrayā",
        meaningSi: "හඳ; රාත්‍රියේ ආලෝකය දෙන ග්‍රහයා.",
        meaningEn: "The moon.",
        exampleSi: "සක්දෙවිඳු හඳ මත සසෙකුගේ ලකුණක් ඇන්දේය.",
        exampleEn: "Sakka painted the sign of a hare on the moon.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: {
          en: "What were the four friends preparing for?",
          si: "මිතුරන් සිව්දෙනා සූදානම් වූයේ කුමකටද?",
        },
        options: [
          { en: "A journey to Benares", si: "බරණැසට යාමට" },
          { en: "A fast day, when they would keep the precepts", si: "සිල් රැකීමට යෙදුණු පොහොය දිනයකට" },
          { en: "A festival in the border village", si: "මායිම් ගමේ උත්සවයකට" },
          { en: "A race through the wood", si: "වනය හරහා ධාවන තරඟයකට" },
        ],
        answer: 1,
        explanation: {
          en: "The hare reads the moon and tells his friends that the next day is a fast day. They agree to keep the precepts and to give food to anyone who asks.",
          si: "සසා හඳ දෙස බලා හෙට පොහොය දිනයක් බව මිතුරන්ට කියයි. ඔවුන් සිල් රැකීමට සහ ඉල්ලන කෙනෙකුට ආහාර දීමට එකඟ වෙති.",
        },
      },
      {
        id: "q2",
        prompt: {
          en: "How did the otter, the jackal and the monkey get their gifts?",
          si: "දියබල්ලා, නරියා සහ වඳුරා තම ත්‍යාග ලබා ගත්තේ කෙසේද?",
        },
        options: [
          { en: "They bought them at the village market", si: "ගමේ වෙළඳපොළෙන් මිලදී ගැනීමෙන්" },
          { en: "They found food that had been left or stored, and called out three times to find an owner", si: "තබා ගිය හෝ ගබඩා කර තිබූ ආහාර සොයාගෙන, හිමිකරු සොයා තෙවරක් කතා කිරීමෙන්" },
          { en: "The hare gave each of them a share", si: "සසා එකිනෙකාට කොටසක් දීමෙන්" },
          { en: "Sakka left food beside their homes", si: "සක්දෙවිඳු ඔවුන්ගේ නිවෙස් ළඟ ආහාර තැබීමෙන්" },
        ],
        answer: 1,
        explanation: {
          en: "Each friend finds food and asks three times whether anyone owns it before carrying it away. The story is careful about honesty, even when nobody is watching.",
          si: "එකිනෙකා ආහාර සොයාගෙන, ඒවා ගෙන යාමට පෙර අයිතිකරුවෙක් සිටීදැයි තෙවරක් අසයි. කවුරුත් නොබලන විටත් අවංකකම වැදගත් බව කතාව පෙන්වයි.",
        },
      },
      {
        id: "q3",
        prompt: {
          en: "Why did the hare shake himself three times before jumping into the fire?",
          si: "සසා ගින්නට පැනීමට පෙර තෙවරක් සිරුර සොලවා ගත්තේ ඇයි?",
        },
        options: [
          { en: "To make himself braver", si: "තමන් තවත් නිර්භීත කර ගැනීමට" },
          { en: "So that any small insects in his fur could escape", si: "ඔහුගේ ලොම් අතර සිටින කුඩා සතුන්ට ගැලවී යාමට" },
          { en: "To signal to his friends", si: "මිතුරන්ට සංඥාවක් දීමට" },
          { en: "Because the grass was tickling him", si: "තණකොළ ඔහුට කිසිකිරීම නිසා" },
        ],
        answer: 1,
        explanation: {
          en: "The text says he shook himself so that any insects within his coat might escape death. Even while giving up his own life, he thinks of smaller lives.",
          si: "තම ලොම් අතර සිටින කුඩා සතුන් මරණයෙන් ගැලවී යාම පිණිස ඔහු සිරුර සොලවා ගත් බව පාලි කතාව කියයි. තම ජීවිතය පවා දන් දෙන විටත් ඔහු කුඩා ජීවිත ගැන සිතයි.",
        },
      },
      {
        id: "q4",
        prompt: {
          en: "Who was the brahmin who came asking for food?",
          si: "ආහාර ඉල්ලා ආ බමුණා කවුද?",
        },
        options: [
          { en: "A fisherman from the river", si: "ගඟේ ධීවරයෙක්" },
          { en: "The king of Benares", si: "බරණැස් රජු" },
          { en: "Sakka, king of the gods, testing the hare", si: "සසා පරීක්ෂා කරන සක්දෙවිඳු" },
          { en: "The hare’s old teacher", si: "සසාගේ පැරණි ගුරුවරයා" },
        ],
        answer: 2,
        explanation: {
          en: "Sakka’s throne grew warm when the hare resolved to give his life. Sakka came in disguise to test that resolve, and revealed himself only afterwards.",
          si: "සසා තම ජීවිතය දන් දීමට තීරණය කළ විට සක්දෙවිඳුගේ අසුන උණුසුම් විය. ඒ අධිෂ්ඨානය පරීක්ෂා කිරීමට ඔහු වේශයකින් ආවේය; පසුව පමණක් සැබෑ ස්වරූපය පෙන්වීය.",
        },
      },
      {
        id: "q5",
        prompt: {
          en: "What happened when the hare sprang onto the burning coals?",
          si: "සසා ගිනි අඟුරු මතට පැන්න විට සිදු වූයේ කුමක්ද?",
        },
        options: [
          { en: "The fire went out and the forest grew dark", si: "ගින්න නිවී වනය අඳුරු විය" },
          { en: "The coals did not even warm the hairs of his body", si: "අඟුරු ඔහුගේ සිරුරේ රෝමයක් පවා උණුසුම් නොකළේය" },
          { en: "He was burned and could not move", si: "ඔහු පිළිස්සී චලනය විය නොහැකි විය" },
          { en: "Rain fell and put out the fire", si: "වැසි වැටී ගින්න නිවී ගියේය" },
        ],
        answer: 1,
        explanation: {
          en: "The fire felt like frost. Sakka’s test was not meant to harm the hare; it was meant to show that his generosity had no hesitation in it.",
          si: "ගින්න සීතලක් මෙන් දැනුණි. සක්දෙවිඳුගේ පරීක්ෂාව සසාට හානි කිරීමට නොව, ඔහුගේ දානයේ කිසිදු පසුබැසීමක් නොමැති බව පෙන්වීමට ය.",
        },
      },
      {
        id: "q6",
        prompt: {
          en: "What sign did Sakka leave so the hare’s gift would be remembered?",
          si: "සසාගේ දානය සිහිපත් වන පිණිස සක්දෙවිඳු තැබූ ලකුණ කුමක්ද?",
        },
        options: [
          { en: "A golden statue in the village", si: "ගමේ රන් ප්‍රතිමාවක්" },
          { en: "A mark like a hare on the moon", si: "හඳ මත සසෙකුගේ ලකුණක්" },
          { en: "A ring of stones around the clearing", si: "මිදුල වටා ගල් වළල්ලක්" },
          { en: "A tree that never loses its leaves", si: "කිසිදා කොළ නොහලන ගසක්" },
        ],
        answer: 1,
        explanation: {
          en: "Sakka squeezed the mountain for its essence and daubed the sign of a hare on the moon — the image many children still see on a full-moon night.",
          si: "සක්දෙවිඳු කන්ද සිර කර එහි සාරය ගෙන හඳ මත සසෙකුගේ ලකුණ ඇන්දේය — පොහොය රැයක බොහෝ දරුවන් අදත් දකින රූපයයි.",
        },
      },
    ],
    sourceReading: {
      label: {
        en: "Source-based reading: the 1897 Pali Text Society translation",
        si: "මූලාශ්‍ර පාඨය: 1897 පාලි තෙක්ස්ට් සොසයිටි පරිවර්තනය",
      },
      attribution: SASA_SOURCE_ATTRIBUTION,
      url: SOURCE_URL,
      editorialNote: {
        en: "This is a public-domain translation, not a new one. Long passages have been lightly trimmed and obvious scanning errors corrected; wording is otherwise unchanged. The verses are the translator’s English rendering of the Pali.",
        si: "මෙය නව පරිවර්තනයක් නොව, පොදු වසමේ පවතින පැරණි පරිවර්තනයකි. දිගු ඡේද කෙටි කර ඇත; පැහැදිලි ස්කෑන් දෝෂ නිවැරදි කර ඇත. අනෙක් වචන එලෙසමය. ගාථා පාලි භාෂාවේ පරිවර්තකයාගේ ඉංග්‍රීසි රචනාවයි.",
      },
      paragraphs: [
        "“Seven red fish,” etc.—This story was told by the Master while living at Jetavana, about a gift of all the Buddhist requisites. A certain landowner at Savatthi provided all the requisites for the Brotherhood with Buddha at its head. At the end of the feast the Master, in returning thanks, said, “Lay Brother, you are right in giving pleasure and satisfaction by this charity. For this is a tradition of wise men of old, who sacrificed their lives for any beggars they met with, and gave them even their own flesh to eat.” And at the request of his host he related this old-world legend.",
        "Once upon a time when Brahmadatta was reigning in Benares, the Bodhisatta came to life as a young hare and lived in a wood. On one side of this wood was the foot of a mountain, on another side a river, and on the third side a border-village. The hare had three friends—a monkey, a jackal and an otter. These four wise creatures lived together, and each of them got his food on his own hunting-ground, and in the evening they again came together. The hare in his wisdom by way of admonition preached the Truth to his three companions, teaching that alms are to be given, the moral law to be observed, and holy days to be kept.",
        "And so in the course of time the Bodhisatta one day observing the sky, and looking at the moon, knew that the next day would be a fast-day, and addressing his three companions he said, “To-morrow is a fast-day. Let all three of you take upon you the moral precepts, and observe the holy day. To one that stands fast in moral practice, almsgiving brings a great reward. Therefore feed any beggars that come to you by giving them food from your own table.” They readily assented, and abode each in his own place of dwelling.",
        "On the morrow quite early in the morning, the otter sallied forth to seek his prey and went down to the bank of the Ganges. Now it came to pass that a fisherman had landed seven red fish, and stringing them together on a withe, he had taken and buried them in the sand on the river’s bank. The otter scenting the buried fish, dug up the sand till he came upon them, and pulling them out cried aloud thrice, “Does any one own these fish?” And not seeing any owner he took hold of the withe with his teeth and laid the fish in the jungle where he dwelt, intending to eat them at a fitting time.",
        "The jackal too sallied forth in quest of food and found in the hut of a field-watcher two spits, a lizard and a pot of milk-curd. And after thrice crying aloud, “To whom do these belong?” and not finding an owner, he put on his neck the rope for lifting the pot, and grasping the spits and the lizard with his teeth, he brought and laid them in his own lair. The monkey also entered the clump of trees, and gathering a bunch of mangoes laid them up in his part of the jungle.",
        "But the Bodhisatta in due time came out, intending to browse on the kusa grass, and as he lay in the jungle, the thought occurred to him, “It is impossible for me to offer grass to any beggars that may chance to appear, and I have no oil or rice and such like. If any beggar shall appeal to me, I shall have to give him my own flesh to eat.” At this splendid display of virtue, Sakka’s white marble throne manifested signs of heat. Sakka on reflection discovered the cause and resolved to put this royal hare to the test.",
        "First of all he went and stood by the otter’s dwelling-place, disguised as a brahmin, and being asked why he stood there, he replied, “Wise Sir, if I could get something to eat, after keeping the fast, I would perform all my priestly duties.” The otter replied, “Very well, I will give you some food,” and as he conversed with him he repeated the first stanza—",
        "“Seven red fish I safely brought to land from Ganges flood,\nO brahmin, eat thy fill, I pray, and stay within this wood.”",
        "The brahmin said, “Let be till to-morrow. I will see to it by and bye.” Next he went to the jackal, who promised him food and repeated the second stanza. Then he went to the monkey, who offered an icy stream, a mango ripe, and pleasant greenwood shade. To each the brahmin said, “Let be till to-morrow.”",
        "And he went to the wise hare, and on being asked by him why he stood there, he made the same reply. The Bodhisatta on hearing what he wanted was highly delighted, and said, “Brahmin, you have done well in coming to me for food. This day will I grant you a boon that I have never granted before, but you shall not break the moral law by taking animal life. Go, friend, and when you have piled together logs of wood, and kindled a fire, come and let me know, and I will sacrifice myself by falling into the midst of the flames, and when my body is roasted, you shall eat my flesh and fulfil all your priestly duties.” And in thus addressing him the hare uttered the fourth stanza—",
        "“Nor sesame, nor beans, nor rice have I as food to give,\nBut roast with fire my flesh I yield, if thou with us wouldst live.”",
        "Sakka, on hearing what he said, by his miraculous power caused a heap of burning coals to appear, and came and told the Bodhisatta. Rising from his bed of kusa grass and coming to the place, he thrice shook himself that if there were any insects within his coat, they might escape death. Then offering his whole body as a free gift he sprang up, and like a royal swan, alighting on a cluster of lotuses, in an ecstasy of joy he fell on the heap of live coals. But the flame failed even to heat the pores of the hair on the body of the Bodhisatta, and it was as if he had entered a region of frost.",
        "Then he addressed Sakka in these words: “Brahmin, the fire you have kindled is icy-cold: it fails to heat even the pores of the hair on my body. What is the meaning of this?” “Wise sir,” he replied, “I am no brahmin. I am Sakka, and I have come to put your virtue to the test.” The Bodhisatta said, “If not only thou, Sakka, but all the inhabitants of the world were to try me in this matter of almsgiving, they would not find in me any unwillingness to give,” and with this the Bodhisatta uttered a cry of exultation like a lion roaring.",
        "Then said Sakka to the Bodhisatta, “O wise hare, be thy virtue known throughout a whole world.” And squeezing the mountain, with the essence thus extracted, he daubed the sign of a hare on the orb of the moon. And after depositing the hare on a bed of young kusa grass, in the same wooded part of the jungle, Sakka returned to his own place in heaven. And these four wise creatures dwelt happily and harmoniously together, fulfilling the moral law and observing holy days, till they departed to fare according to their deeds.",
      ],
    },
  },
};
