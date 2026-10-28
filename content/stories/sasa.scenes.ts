import type { ReaderScene } from "./types";

const ATTRIBUTION =
  "H. T. Francis & R. A. Neil, The Jātaka, Vol. III (1897), public domain, via SuttaCentral";

export const sasaScenes: readonly ReaderScene[] = [
  {
    id: "four-friends",
    title: { en: "The Four Friends", si: "මිතුරන් සිව්දෙනා" },
    setting: { en: "A wood between mountain, river and village", si: "කන්ද, ගඟ සහ ගම අතර වනාන්තරය" },
    environment: "forest",
    palette: "dawn",
    light: "dawn",
    text: {
      en: "Long ago, when Brahmadatta ruled in Benares, the Bodhisatta was born as a hare and lived in a wood. On one side of the wood rose a mountain; on another ran a river; on the third lay a border village. The hare had three friends — an otter, a jackal and a monkey — and the four lived together in easy friendship. Each morning they went their own way to find food. Each evening they returned, gathered beneath the trees, and listened while the hare spoke of giving, of keeping a kind heart, and of the value of a well-kept day.",
      si: "බරණැස් නුවර බ්‍රහ්මදත්ත රජු රජ කරන කාලයේ, බෝධිසත්වයන් සසෙක් ලෙස උපත ලැබූහ. එක් පැත්තකින් කන්දක්, තවත් පැත්තකින් ගඟක්, තුන්වන පැත්තෙන් මායිම් ගමක් වූ වනාන්තරයේ ඔහු වාසය කළේය. ඔහුට මිතුරන් තිදෙනෙක් සිටියේය — දියබල්ලෙක්, නරියෙක් සහ වඳුරෙක්. සිව්දෙනා එකට සිටිමින් සතුටින් කල් ගෙවූහ. හැම උදෑසනකම ඔවුන් තම තමන්ගේ ආහාර සොයා ගියහ. සවස් වන විට නැවත එකතු වී, ගස් යට වාඩි වී, දීම, කරුණාව සහ යහපත් දවසක වටිනාකම ගැන සසා කියන දේ අසමින් සිටියහ.",
    },
    vocabulary: ["බෝධිසත්ව", "වනාන්තරය"],
    hotspots: [
      {
        id: "hare",
        x: 62,
        y: 63,
        kind: "character",
        label: { en: "The Hare", si: "සසා" },
        body: {
          en: "The Bodhisatta in the form of a hare. In this life he is the smallest of the four friends, yet the one they turn to for guidance.",
          si: "සසෙකුගේ ස්වරූපයෙන් සිටින බෝධිසත්වයන්. මෙම ආත්මයේ ඔහු මිතුරන් අතරින් කුඩාම වුවත්, ඔවුන් උපදෙස් ගන්නේ ඔහුගෙන්ය.",
        },
      },
      {
        id: "mountain",
        x: 20,
        y: 34,
        kind: "place",
        label: { en: "The Mountain", si: "කන්ද" },
        body: {
          en: "The wood is bounded by a mountain. In the old storytelling tradition, such clear boundaries help a listener picture the whole world of the tale.",
          si: "වනාන්තරයේ එක් මායිමක් කන්දයි. පැරණි කතා සම්ප්‍රදායේදී මෙවැනි පැහැදිලි මායිම් මගින් කතාවේ ලෝකය මනසින් දකින්නට උපකාර වේ.",
        },
      },
      {
        id: "friends",
        x: 40,
        y: 72,
        kind: "character",
        label: { en: "Three Companions", si: "මිතුරන් තිදෙනා" },
        body: {
          en: "The otter, the jackal and the monkey. Each will be tested in his own way when a stranger comes asking for food.",
          si: "දියබල්ලා, නරියා සහ වඳුරා. ආහාර ඉල්ලා අමුත්තෙක් පැමිණි විට ඔවුන් තම තමන්ගේ ආකාරයට පරීක්ෂාවට ලක් වේ.",
        },
      },
    ],
    mapLocationId: "wood",
  },
  {
    id: "fast-day",
    title: { en: "The Moon That Kept Time", si: "කාලය කී කඳු" },
    setting: { en: "Full moon rising over the wood", si: "වනයට ඉහළින් පොහොය හඳ" },
    environment: "night",
    palette: "dusk",
    light: "dusk",
    text: {
      en: "One evening the hare looked up and read the sky. The moon was nearly full. Tomorrow would be a fast day — a day for keeping the precepts and for giving. He called his three friends close. “Tomorrow, let each of you observe the holy day,” he said. “To one who stands firm in virtue, a gift given brings great fruit. If a beggar comes to you, feed him from what you have.” The otter, the jackal and the monkey nodded, and each went back to his own dwelling with the promise held quietly in his heart.",
      si: "එක් සවසක සසා අහස දෙස බලා කාලය කියවා ගත්තේය. හඳ පොහොයට ආසන්නය. හෙට පොහොය දිනයකි — සිල් රැකීමට සහ දන් දීමට සුදුසු දිනයකි. ඔහු මිතුරන් තිදෙනා ලඟට කැඳවා කීවේය: “හෙට දිනයේ ඔබ තුන්දෙනාම සිල් සමාදන් වෙත්වා. සිල්වත් අයෙකුට දෙන දානය මහත් ඵල ගෙන දේ. යාචකයෙක් ඔබ ළඟට ආවොත්, ඔබ ළඟ ඇති දෙයින් ඔහුට ආහාර දෙන්න.” දියබල්ලා, නරියා සහ වඳුරා හිස සලා එකඟ වූහ. එකිනෙකා තම නවාතැනට ගියේ, ඒ පොරොන්දුව නිහඬව හදවතේ රඳවාගෙනය.",
    },
    vocabulary: ["පොහොය", "සීලය", "දානය"],
    hotspots: [
      {
        id: "moon",
        x: 74,
        y: 22,
        kind: "object",
        label: { en: "The Full Moon", si: "පොහොය හඳ" },
        body: {
          en: "In Sri Lankan Buddhist practice, full-moon (poya) days are set aside for observing precepts, listening to Dhamma and giving. The tale turns on the hare reading the lunar calendar correctly.",
          si: "ශ්‍රී ලංකාවේ බෞද්ධ සම්ප්‍රදායේ පොහොය දින සිල් සමාදන් වීමට, බණ ඇසීමට සහ දන් දීමට වෙන් කර ඇත. කතාවේ හැරවුම සසා නිවැරදිව පොහොය දිනය හඳුනා ගැනීමයි.",
        },
      },
      {
        id: "precepts",
        x: 40,
        y: 66,
        kind: "object",
        label: { en: "The Precepts", si: "සිල්" },
        body: {
          en: "The friends agree to keep the five precepts for a day — beginning with not taking life. That promise shapes everything that follows.",
          si: "මිතුරන් දිනකට පංචසීලය රකින්නට එකඟ වෙති. එය ආරම්භ වන්නේ ප්‍රාණඝාතයෙන් වැළකීමෙනි. ඒ පොරොන්දුව ඉන්පසු සිදුවන සියල්ල හැඩගස්වයි.",
        },
      },
    ],
    mapLocationId: "wood",
  },
  {
    id: "three-gifts",
    title: { en: "Three Gifts", si: "ත්‍යාග තුන" },
    setting: { en: "The riverbank, a field hut, a mango grove", si: "ගං ඉවුර, කුඹුරු ගෙය, අඹ වනය" },
    environment: "river",
    palette: "gold",
    light: "day",
    text: {
      en: "On the fast day the otter went down to the river. A fisherman had buried seven red fish in the sand and gone downstream. The otter dug them up, called out three times to ask whether anyone owned them, and — hearing no answer — carried them home for the right hour.\n\nThe jackal found a field-watcher’s hut with two spits, a lizard and a jar of curd. He called out three times, found no owner, and carried them to his lair. The monkey gathered a bunch of ripe mangoes and laid them by.\n\nEach of them lay down afterwards, quietly certain of his own goodness. None of them had taken life. Each had something to give.",
      si: "පොහොය දිනයේ දියබල්ලා ගඟ අද්දරට ගියේය. ධීවරයෙක් රතු මාළු හතක් වැලි තුළ වළදා ගඟ දිගේ බැස ගොස් සිටියේය. දියබල්ලා ඒවා අවුස්සා ගෙන, “මේවා කාගේද?” යැයි තෙවරක් ඇසීය. පිළිතුරක් නොලැබුණු විට ඒවා නියම වේලාවට ගෙන යාමට තම ගුහාවට ගෙන ගියේය.\n\nනරියාට කුඹුරු ගෙයක් තුළ හුලස් දෙකක්, කුඹුරු කටුස්සෙක් සහ කිරි කෝප්පයක් හමු විය. ඔහුද තෙවරක් කතා කර, අයිතිකරුවෙක් නොමැති බව දැනගෙන ඒවා තම සැඟවුම් ස්ථානයට ගෙන ගියේය. වඳුරා ඉදුණු අඹ පොකුරක් නෙළා තබා ගත්තේය.\n\nපසුව ඔවුන් තම තමන්ගේ යහපත්කම ගැන සිතමින් සුවසේ වැතිර ගත්හ. ඔවුන් කිසිවෙක් ප්‍රාණඝාතය නොකළහ. එකිනෙකාට දිය හැකි දෙයක් තිබුණි.",
    },
    vocabulary: ["දානය", "අවංකකම"],
    hotspots: [
      {
        id: "fish",
        x: 28,
        y: 70,
        kind: "object",
        label: { en: "Seven Red Fish", si: "රතු මාළු හත" },
        body: {
          en: "The otter asks three times whether the fish have an owner before taking them. The tale is careful about the difference between stealing and receiving what is unclaimed.",
          si: "දියබල්ලා මාළු ගැනීමට පෙර ඒවාට අයිතිකරුවෙක් සිටීදැයි තෙවරක් අසයි. සොරකම සහ හිමිකරු නොමැති දෙයක් ලබා ගැනීම අතර ඇති වෙනස කතාව හොඳින් පැහැදිලි කරයි.",
        },
      },
      {
        id: "riverbank",
        x: 55,
        y: 82,
        kind: "place",
        label: { en: "The Riverbank", si: "ගං ඉවුර" },
        body: {
          en: "The river is the otter’s hunting ground. In the Pali telling it is the Ganges; the story uses a real river as an ordinary, familiar place.",
          si: "ගඟ දියබල්ලාගේ ආහාර සොයන තැනයි. පාලි කතාවේ එය ගංගා නදියයි; කතාව සාමාන්‍ය මිනිසුන්ට හුරු පුරුදු සැබෑ ගඟක් භාවිත කරයි.",
        },
      },
      {
        id: "mangoes",
        x: 80,
        y: 52,
        kind: "object",
        label: { en: "The Mangoes", si: "අඹ" },
        body: {
          en: "The monkey’s gift is the simplest: fruit gathered from the grove where he lives. Generosity does not require wealth.",
          si: "වඳුරාගේ ත්‍යාගය සරලම දෙයයි: ඔහු ජීවත් වන වනයෙන් නෙළාගත් පලතුරු. දානයට ධනය අවශ්‍ය නොවේ.",
        },
      },
    ],
    mapLocationId: "river",
  },
  {
    id: "only-gift",
    title: { en: "The Hare’s Only Gift", si: "සසාගේ එකම ත්‍යාගය" },
    setting: { en: "Kusa grass at the edge of the wood", si: "වනය අද්දර කුස තණ" },
    environment: "forest",
    palette: "night",
    light: "night",
    text: {
      en: "The hare came out to browse on kusa grass, and there a thought settled on him like a weight. “I have no sesame, no beans, no rice. If a beggar comes to me, I cannot offer him grass. There is only one thing I can give.” Evening deepened. The thought did not leave him; it grew clearer and quieter. He would give his own body.\n\nThe old text says that at that moment Sakka’s white marble throne grew warm. The king of the gods looked down, saw who had caused it, and decided to test this small creature’s resolve.",
      si: "සසා කුස තණ කෑමට වනය අද්දරට ආවේය. එහිදී ඔහු සිතට බරක් වගේ අදහසක් ආවේය. “මා ළඟ තල, කව්පි, සහල් නැත. යාචකයෙක් මා ළඟට ආවොත් ඔහුට තණකොළ දිය නොහැක. මට දිය හැකි එකම දේ එකකි.” සවස ගැඹුරු විය. ඒ අදහස ඔහුගෙන් ඉවත් නොවී, වඩා පැහැදිලිව, වඩා නිහඬව වැඩෙන්නට විය. ඔහු තම සිරුරම දන් දෙනු ඇත.\n\nඑකල්හි සක්දෙවිඳුන්ගේ සුදු කිරිගරුඬ අසුන උණුසුම් වූ බව පැරණි පාලි කතාව කියයි. දෙවියන්ගේ රජු බලා, මෙයට හේතුවූයේ කවුරුන්දැයි දැනගෙන, මේ කුඩා සත්වයාගේ අධිෂ්ඨානය පරීක්ෂා කරන්නට තීරණය කළේය.",
    },
    vocabulary: ["කරුණාව", "අධිෂ්ඨානය"],
    hotspots: [
      {
        id: "grass",
        x: 34,
        y: 76,
        kind: "object",
        label: { en: "Kusa Grass", si: "කුස තණ" },
        body: {
          en: "The hare’s bed and his only food. It is also the humble offering he decides is not enough for a hungry stranger.",
          si: "සසාගේ යහන් තැන සහ එකම ආහාරය. බඩගිනි අමුත්තෙකුට එය ප්‍රමාණවත් නොවන බව ඔහු තීරණය කරයි.",
        },
      },
      {
        id: "resolve",
        x: 63,
        y: 60,
        kind: "character",
        label: { en: "The Decision", si: "තීරණය" },
        body: {
          en: "This is the heart of the tale: a gift measured not by its size but by what it costs the giver.",
          si: "මෙය කතාවේ හදවතයි: ත්‍යාගයක වටිනාකම එහි ප්‍රමාණයෙන් නොව, දෙන්නාට එයින් වන පිරිවැයෙන් තීරණය වේ.",
        },
      },
    ],
    mapLocationId: "wood",
  },
  {
    id: "the-test",
    title: { en: "The Brahmin at the Door", si: "දොර ළඟ බමුණා" },
    setting: { en: "Four dwellings, one asking voice", si: "නවාතැන් හතරක්, එකම ඉල්ලීම" },
    environment: "hermitage",
    palette: "dusk",
    light: "dusk",
    text: {
      en: "Sakka took the form of a wandering brahmin and went from dwelling to dwelling. To each he said the same thing: “I have kept the fast. If I had something to eat, I would finish my duties.”\n\nThe otter offered his seven fish. “Eat your fill,” he said, “and stay in this wood.” The jackal offered his lizard and curd, admitting plainly that he had taken them without asking. The monkey offered ripe mangoes, a cool stream and green shade.\n\nTo each the brahmin said, “Let it wait until tomorrow.” Then he came to the hare.",
      si: "සක්දෙවිඳු තාපසයෙකුගේ හෝ බමුණෙකුගේ වේශයෙන් එක් එක් නවාතැනට ගියේය. හැමෝටම ඔහු එකම දේ කීවේය: “මා සිල් සමාදන් වී සිටිමි. ආහාරයක් ලැබුණොත් මගේ කටයුතු නිම කරන්නට පුළුවන්.”\n\nදියබල්ලා තම රතු මාළු හත පිළිගැන්වීය. “පිරෙන තරමට කන්න, මේ වනයේ නවාතැන් ගන්න” යැයි ඔහු කීවේය. නරියා තම කුඹුරු කටුස්සා සහ කිරි කෝප්පය පිළිගැන්වූයේ, ඒවා අස්කර ගත් බව අවංකව පිළිගනිමිනි. වඳුරා ඉදුණු අඹ, සිසිල් දිය දහරක් සහ හරිත සෙවණක් පිළිගැන්වීය.\n\nහැමෝටම බමුණා කීවේ, “හෙට තෙක් ඉඩ තබන්න” යනුවෙනි. ඉන්පසු ඔහු සසා ළඟට ආවේය.",
    },
    vocabulary: ["තාපස", "අවංකකම"],
    hotspots: [
      {
        id: "sakka",
        x: 50,
        y: 58,
        kind: "character",
        label: { en: "Sakka", si: "සක්දෙවිඳු" },
        body: {
          en: "Sakka, king of the gods in Buddhist cosmology, appears here as a tester of virtue rather than a rewarder of wealth. His disguise is a hungry traveller.",
          si: "බෞද්ධ විශ්වාසයේ දෙවියන්ගේ රජු වන සක්දෙවිඳු මෙහි පෙනෙන්නේ ධනය ත්‍යාග කරන්නෙකු ලෙස නොව, ගුණය පරීක්ෂා කරන්නෙකු ලෙසය. ඔහුගේ වේශය බඩගිනි සංචාරකයෙකි.",
        },
      },
      {
        id: "otter-gift",
        x: 22,
        y: 72,
        kind: "object",
        label: { en: "The Otther’s Offer", si: "දියබල්ලාගේ පිළිගැන්වීම" },
        body: {
          en: "The friends give what they have gathered. Their generosity is real, though each gift has an uneasy edge — the story does not pretend otherwise.",
          si: "මිතුරන් තමන් එකතු කරගත් දේ පිළිගන්වති. ඔවුන්ගේ දානය සැබෑය; නමුත් හැම ත්‍යාගයකම යම් අපහසුවක් තිබේ — කතාව එය සඟවන්නේ නැත.",
        },
      },
    ],
    mapLocationId: "border-village",
  },
  {
    id: "cold-fire",
    title: { en: "The Fire That Was Cold", si: "සීතල වූ ගිනි" },
    setting: { en: "A clearing, a heap of burning coals", si: "වනයේ මිදුලක්, ගිනි අඟුරු ගොඩක්" },
    environment: "forest",
    palette: "ember",
    light: "fire",
    text: {
      en: "The hare heard the request and was glad. “You have done well to come to me,” he said. “Today I will give what I have never given before. But do not break the precept by taking life. Gather wood and kindle a fire, then tell me. I will fall into it, and when my body is roasted you may eat and finish your duties.”\n\nSakka made a heap of burning coals appear. The hare rose from his bed of grass and shook himself three times — so that any small insects in his fur might escape. Then, as a royal swan settles onto a cluster of lotuses, he sprang onto the coals.\n\nThe fire did not even warm the hairs of his body. It was as if he had stepped into frost.",
      si: "සසා ඒ ඉල්ලීම අසා සතුටු විය. “මා ළඟට ආවා හොඳයි,” ඔහු කීවේය. “අද මා කිසිදා නොදුන් දෙයක් දෙන්නෙමි. නමුත් ප්‍රාණඝාතයෙන් සිල් නොකඩ කරන්න. දර එකතු කර ගින්නක් දල්වා මට කියන්න. මා එයට පනිමි. මගේ සිරුර පිසුණු වූ පසු ඔබට කා මගේ යුතුකම් ඉටු කරගත හැක.”\n\nසක්දෙවිඳු ගිනි අඟුරු ගොඩක් මවා පෑවේය. සසා තණ යහනින් නැගිට, තම ලොම් අතර සිටින කුඩා කුහුඹුවන්ට ගැලවී යාමට හැකි වන පිණිස තෙවරක් සිරුර සොලවා ගත්තේය. ඉන්පසු රාජහංසයෙක් නෙළුම් පොකුරක් මතට බසින්නා සේ ඔහු ගිනි අඟුරු මතට පැන්නේය.\n\nගින්න ඔහුගේ සිරුරේ රෝමයක් පවා උණුසුම් නොකළේය. ඔහු සීතල තැනකට බැස්සාක් මෙනි.",
    },
    vocabulary: ["සීලය", "කරුණාව", "අග්නිය"],
    hotspots: [
      {
        id: "coals",
        x: 55,
        y: 78,
        kind: "object",
        label: { en: "The Heap of Coals", si: "ගිනි අඟුරු ගොඩ" },
        body: {
          en: "Sakka’s fire is a test, not a punishment. In the tale it has no heat at all — the point is the hare’s readiness, not his suffering.",
          si: "සක්දෙවිඳුගේ ගින්න දඬුවමක් නොව පරීක්ෂාවකි. කතාවේ එයට උණුසුමක් නැත — වැදගත් වන්නේ සසාගේ සූදානමයි, ඔහුගේ දුක් විඳීම නොවේ.",
        },
      },
      {
        id: "three-shakes",
        x: 40,
        y: 62,
        kind: "character",
        label: { en: "Three Shakes", si: "තෙවරක් සෙලවීම" },
        body: {
          en: "Before offering himself, the hare thinks of the insects in his fur. The smallest detail in the story is also the most generous one.",
          si: "තමන් දන් දීමට පෙර සසා තම ලොම් අතර සිටින කුඩා සතුන් ගැන සිතයි. කතාවේ කුඩාම විස්තරයම වඩාත් මහත් දයාව පෙන්වයි.",
        },
      },
    ],
    mapLocationId: "clearing",
  },
  {
    id: "hare-in-the-moon",
    title: { en: "The Hare in the Moon", si: "හඳේ සිටින සසා" },
    setting: { en: "The moon, and a bed of young grass", si: "හඳ සහ තණ යහන" },
    environment: "night",
    palette: "night",
    light: "night",
    text: {
      en: "“Brahmin,” said the hare, “the fire you kindled is cold. What does this mean?” The brahmin answered, “I am no brahmin. I am Sakka, and I came to test your virtue.”\n\nThe hare said, “If not only you, but every being in the world came to try me in giving, they would find no unwillingness in me.” And he gave a cry of joy like a lion’s roar.\n\nSakka praised him, squeezed the mountain to draw out its essence, and daubed the sign of a hare on the orb of the moon — so that the hare’s giving would be remembered for a whole world-age. Then he set the hare back on a bed of young grass and returned to his own place. The four friends lived on happily, keeping the precepts, until they went their way according to their deeds.",
      si: "“බමුණ, ඔබ දැල්වූ ගින්න සීතලය. මෙයින් අදහස් කුමක්ද?” සසා ඇසීය. “මම බමුණෙක් නොවෙමි. මම සක්දෙවිඳු. ඔබේ ගුණය පරීක්ෂා කරන්නට ආමි,” ඔහු පිළිතුරු දුන්නේය.\n\n“ඔබ පමණක් නොව මුළු ලෝකයේ සියලු සත්වයෝ මා දන් දීම ගැන පරීක්ෂා කළත්, මා තුළ අකැමැත්තක් නොදකිති,” සසා කීවේය. ඉන්පසු සිංහ නාදයක් මෙන් සතුටු හඬක් නැගීය.\n\nසක්දෙවිඳු ඔහුට ප්‍රශංසා කොට, කන්ද සිර කර එහි සාරය ගෙන, හඳ මඬලේ සසෙකුගේ ලකුණක් අඳින්නට විය — සසාගේ දානය මුළු ලෝක යුගයක් මතක තබා ගැනීම පිණිසය. ඉන්පසු ඔහු සසා නැවත තණ යහනක් මත තබා තම නිවසට ගියේය. මිතුරන් සිව්දෙනා සිල් රැක ගනිමින් සතුටින් ජීවත් වූහ; පසුව තම කර්මයට අනුව ගියහ.",
    },
    vocabulary: ["පින්", "චන්ද්‍රයා", "බෝධිසත්ව"],
    hotspots: [
      {
        id: "moon-mark",
        x: 70,
        y: 24,
        kind: "object",
        label: { en: "The Hare on the Moon", si: "හඳේ සසා ලකුණ" },
        body: {
          en: "The mark on the moon is the tale’s closing image. In Sri Lanka the full-moon day and the hare in the moon are both familiar cultural references — the story explains one with the other.",
          si: "හඳේ ඇති ලකුණ කතාවේ අවසන් රූපයයි. ශ්‍රී ලංකාවේ පොහොය දිනය සහ හඳේ සසා යන දෙකම හුරුපුරුදු සංස්කෘතික සඳහනකි — කතාව එකක් අනෙකෙන් පැහැදිලි කරයි.",
        },
      },
      {
        id: "lion-roar",
        x: 42,
        y: 64,
        kind: "character",
        label: { en: "The Lion’s Roar", si: "සිංහ නාදය" },
        body: {
          en: "A traditional image for fearless confidence. The hare is not boasting; he is saying that generosity has become part of his nature.",
          si: "නිර්භීත විශ්වාසය සඳහා සම්ප්‍රදායික රූපයකි. සසා උඩඟුකම් නොකරයි; දානය ඔහුගේ ස්වභාවයම බවට පත්ව ඇති බවයි ඔහු කියන්නේ.",
        },
      },
    ],
    mapLocationId: "moon",
  },
];

export const SASA_SOURCE_ATTRIBUTION = ATTRIBUTION;
