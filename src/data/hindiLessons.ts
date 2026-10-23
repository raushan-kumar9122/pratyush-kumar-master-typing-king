/**
 * Hindi typing lessons for PRATYUSH KUMAR MASTER PRO
 * Unicode Devanagari curriculum with Inscript and Remington Gail layout guides.
 */

import { HindiLesson } from '../types';

export const HINDI_LESSONS: HindiLesson[] = [
  {
    id: 'hin-1',
    title: 'अभ्यास 1: मूल वर्ण (स्वर और व्यंजन)',
    category: 'characters',
    level: 'beginner',
    description: 'देवनागरी वर्णमाला के प्राथमिक अक्षरों का अभ्यास।',
    content: 'क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व श ष स ह',
    inscriptGuide: 'क = k, ख = K, ग = i, घ = I, च = ;, छ = :, ज = p, झ = P, त = l, न = v, प = h, म = c, य = /, र = j, ल = n, व = b, स = m, ह = u',
    remingtonGuide: 'रेमिंगटन लेआउट में d = क, [ = ख, x = ग, ? = घ, p = च, P = छ, t = ज, T = झ, l = त, v = न, i = प, c = म'
  },
  {
    id: 'hin-2',
    title: 'अभ्यास 2: मात्रा अभ्यास (Matras Practice)',
    category: 'matras',
    level: 'beginner',
    description: 'आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ एवं अनुस्वार की मात्राओं का अभ्यास।',
    content: 'का कि की कु कू के कै को कौ कं कः ता ति ती तु तू ते तै तो तौ तं तः मा मि मी मु मू मे मै मो मौ मं मः',
    inscriptGuide: 'ा = e, ि = f, ी = r, ु = g, ू = t, े = s, ै = w, ो = a, ौ = q, ं = x, ् = d (हलंत)',
    remingtonGuide: 'ा = a, ि = f, ी = r, ु = m, ू = M, े = s, ै = S, ो = k, ौ = K'
  },
  {
    id: 'hin-3',
    title: 'अभ्यास 3: संयुक्त अक्षर (Combined Characters & Halant)',
    category: 'combined',
    level: 'intermediate',
    description: 'हलंत (्) का उपयोग करके बनने वाले संयुक्त वर्ण: क्ष, त्र, ज्ञ, श्र, द्व, प्र, बुद्धि।',
    content: 'क्ष त्र ज्ञ श्र द्व प्र क्र ध्य क्य स्त न्द प्त म्प ल्प श्य त्य व्य ज्ञानी आश्रम प्रकाश विद्या द्वार',
    inscriptGuide: 'क्ष = क + ् + ष (k + d + <), त्र = त + ् + र (l + d + j), ज्ञ = ज + ् + ञ (p + d + })',
    remingtonGuide: 'हलंत हेतु (+) का प्रयोग करें अथवा विशेष कोड का उपयोग करें।'
  },
  {
    id: 'hin-4',
    title: 'अभ्यास 4: सरल हिंदी शब्द (Basic Hindi Words)',
    category: 'words',
    level: 'intermediate',
    description: 'दैनिक जीवन में प्रयुक्त होने वाले महत्वपूर्ण हिंदी शब्द।',
    content: 'कमल जल घर फल नगर समय सफल भारत कलम पुस्तक देश मित्र सत्य ज्ञान धर्म कर्म शांति प्रकाश जीवन',
    inscriptGuide: 'सीधे शब्द टाइप करें। मात्रा लगाने हेतु व्यंजन के पश्चात मात्रा कुंजी दबाएं।',
    remingtonGuide: 'रेमिंगटन कीबोर्ड में हिंदी टाइपिंग करते समय सही क्रम का ध्यान रखें।'
  },
  {
    id: 'hin-5',
    title: 'अभ्यास 5: हिंदी वाक्य अभ्यास (Hindi Sentences)',
    category: 'sentences',
    level: 'advanced',
    description: 'पूर्ण विराम (।) सहित हिंदी वाक्यों का निरंतर गति अभ्यास।',
    content: 'कंप्यूटर आधुनिक विज्ञान का एक अद्भुत वरदान है। विद्या से मनुष्य का जीवन संवरता है। कठिन परिश्रम ही सफलता की कुंजी है। भारत एक महान और विशाल देश है। सत्यमेव जयते।',
    inscriptGuide: 'पूर्ण विराम (।) हेतु Inscript में Shift + > दबाएं।',
    remingtonGuide: 'पूर्ण विराम हेतु (A) कुंजी दबाएं।'
  },
  {
    id: 'hin-6',
    title: 'अभ्यास 6: कंप्यूटर शिक्षा एवं तकनीकी गद्यांश (Speed Paragraph)',
    category: 'paragraphs',
    level: 'advanced',
    description: 'द फ्यूचर ट्रैक कंप्यूटर एजुकेशन आधिकारिक परीक्षा गद्यांश।',
    content: 'द फ्यूचर ट्रैक कंप्यूटर एजुकेशन में आपका स्वागत है। कंप्यूटर टाइपिंग आज के डिजिटल युग में प्रत्येक छात्र के लिए अनिवार्य कौशल बन चुका है। नियमित अभ्यास, सही उंगलियों की स्थिति और एकाग्रता से आप अपनी गति और सटीकता को कई गुना बढ़ा सकते हैं। अभ्यास ही सफलता का मूल मंत्र है।',
    inscriptGuide: 'पहरा टाइप करते समय शब्दों के बीच एक स्पेस दें और विराम चिह्नों पर ध्यान दें।',
    remingtonGuide: 'टाइपिंग स्पीड टेस्ट के लिए निर्धारित समय में शुद्धता बनाए रखें।'
  },
  {
    id: 'hin-7',
    title: 'अभ्यास 7: विशेषज्ञ स्पीड टेस्ट गद्यांश (Expert Hindi Speed)',
    category: 'speed',
    level: 'expert',
    description: 'सरकारी एवं अर्ध-सरकारी टाइपिंग परीक्षा (CPCT, SSC, High Court) हेतु विशेष गद्यांश।',
    content: 'सूचना प्रौद्योगिकी के इस क्रांतिकारी दौर में कंप्यूटर साक्षरता राष्ट्रीय विकास का मुख्य आधार बन चुकी है। कार्यालयीन कामकाज, अभिलेख प्रबंधन, त्वरित संचार और प्रशासनिक पारदर्शिता के लिए कुशल कंप्यूटर ऑपरेटरों की निरंतर मांग बढ़ रही है। टाइपिंग में गति के साथ शुद्धता का सर्वोच्च महत्व है।',
    inscriptGuide: 'परीक्षा हेतु अनुशंसित गति: 30 से 40 शब्द प्रति मिनट, शुद्धता 95% से अधिक।',
    remingtonGuide: 'बैकस्पेस का कम से कम उपयोग करें।'
  }
];

export const HINDI_KEY_MAP = {
  // Inscript reference table for on-screen helpers
  vowels: [
    { char: 'अ', key: 'D' },
    { char: 'आ', key: 'E' },
    { char: 'इ', key: 'F' },
    { char: 'ई', key: 'R' },
    { char: 'उ', key: 'G' },
    { char: 'ऊ', key: 'T' },
    { char: 'ए', key: 'S' },
    { char: 'ऐ', key: 'W' },
    { char: 'ओ', key: 'A' },
    { char: 'औ', key: 'Q' },
  ],
  matras: [
    { char: 'ा', key: 'e' },
    { char: 'ि', key: 'f' },
    { char: 'ी', key: 'r' },
    { char: 'ु', key: 'g' },
    { char: 'ू', key: 't' },
    { char: 'े', key: 's' },
    { char: 'ै', key: 'w' },
    { char: 'ो', key: 'a' },
    { char: 'ौ', key: 'q' },
    { char: 'ं', key: 'x' },
    { char: '्', key: 'd' },
  ],
  consonants: [
    { char: 'क', key: 'k' },
    { char: 'ख', key: 'K' },
    { char: 'ग', key: 'i' },
    { char: 'घ', key: 'I' },
    { char: 'च', key: ';' },
    { char: 'छ', key: ':' },
    { char: 'ज', key: 'p' },
    { char: 'झ', key: 'P' },
    { char: 'ट', key: '\'' },
    { char: 'ठ', key: '"' },
    { char: 'ड', key: '[' },
    { char: 'ढ', key: '{' },
    { char: 'त', key: 'l' },
    { char: 'थ', key: 'L' },
    { char: 'द', key: 'o' },
    { char: 'ध', key: 'O' },
    { char: 'न', key: 'v' },
    { char: 'प', key: 'h' },
    { char: 'फ', key: 'H' },
    { char: 'ब', key: 'y' },
    { char: 'भ', key: 'Y' },
    { char: 'म', key: 'c' },
    { char: 'य', key: '/' },
    { char: 'र', key: 'j' },
    { char: 'ल', key: 'n' },
    { char: 'व', key: 'b' },
    { char: 'श', key: 'M' },
    { char: 'ष', key: '<' },
    { char: 'स', key: 'm' },
    { char: 'ह', key: 'u' },
  ]
};
