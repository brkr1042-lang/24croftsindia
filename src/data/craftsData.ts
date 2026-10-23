import {
  type CraftCategory,
  type CraftProfile,
  type CinemaAdItem,
  type ContactAccessRequest,
  type ProductionHouseRecord,
  type CastingProfileDetails,
  encryptAndMaskAadhaar,
} from '../utils/cinemaLogic';

export const TWENTY_FOUR_CRAFTS: CraftCategory[] = [
  {
    id: 1,
    code: 'CRAFT-01',
    nameTe: '1. దర్శకత్వ విభాగం',
    nameEn: '1. Direction Department',
    nameHi: '1. निर्देशन विभाग',
    taglineTe: '"నౌకకు కెప్టెన్" వంటివారు.',
    taglineEn: 'Captain of the ship — creative vision and execution.',
    taglineHi: 'जहाज के कप्तान की तरह — रचनात्मक दृष्टि।',
    subCategories: [
      { id: '1-1', nameTe: 'ప్రధాన దర్శకుడు', nameEn: 'Main Director', nameHi: 'मुख्य निर्देशक' },
      { id: '1-2', nameTe: 'సహ-దర్శకుడు', nameEn: 'Co-Director', nameHi: 'सह-निर्देशक' },
      { id: '1-3', nameTe: 'అసోసియేట్ డైరెక్టర్', nameEn: 'Associate Director', nameHi: 'एसोसिएट निर्देशक' },
      { id: '1-4', nameTe: 'మొదటి సహాయ దర్శకుడు (1st AD)', nameEn: 'First Assistant Director (1st AD)', nameHi: 'प्रथम सहायक निर्देशक (1st AD)' },
      { id: '1-5', nameTe: 'రెండవ సహాయ దర్శకుడు (2nd AD)', nameEn: 'Second Assistant Director (2nd AD)', nameHi: 'द्वितीय सहायक निर्देशक (2nd AD)' },
      { id: '1-6', nameTe: 'మూడవ సహాయ దర్శకుడు (3rd AD)', nameEn: 'Third Assistant Director (3rd AD)', nameHi: 'तृतीय सहायक निर्देशक (3rd AD)' },
      { id: '1-7', nameTe: 'స్క్రిప్ట్ సూపర్వైజర్ (కంటిన్యూటీ)', nameEn: 'Script Supervisor (Continuity)', nameHi: 'स्क्रिप्ट सुपरवाइज़र' },
    ],
  },
  {
    id: 2,
    code: 'CRAFT-02',
    nameTe: '2. సినిమా రచయితలు / స్క్రిప్ట్ విభాగం',
    nameEn: '2. Film Writers / Script Department',
    nameHi: '2. पटकथा एवं लेखक विभाग',
    taglineTe: 'బ్లూప్రింట్ సృష్టికర్తలు.',
    taglineEn: 'Architects of the story blueprint and screenplay.',
    taglineHi: 'कहानी और पटकथा के निर्माता।',
    subCategories: [
      { id: '2-1', nameTe: 'కథా రచయిత', nameEn: 'Story Writer', nameHi: 'कहानी लेखक' },
      { id: '2-2', nameTe: 'స్క్రీన్ప్లే రచయిత', nameEn: 'Screenplay Writer', nameHi: 'पटकथा लेखक' },
      { id: '2-3', nameTe: 'సంభాషణల రచయిత', nameEn: 'Dialogue Writer', nameHi: 'संवाद लेखक' },
      { id: '2-4', nameTe: 'స్క్రిప్ట్ డాక్టర్', nameEn: 'Script Doctor', nameHi: 'स्क्रिप्ट डॉक्टर' },
    ],
  },
  {
    id: 3,
    code: 'CRAFT-03',
    nameTe: '3. సినీ కళాకారులు (నటీనటులు / క్యాస్టింగ్)',
    nameEn: '3. Cinema Artists (Actors, Actresses & Casting)',
    nameHi: '3. सिनेमा कलाकार (अभिनेता/अभिनेत्री)',
    taglineTe: 'ప్రధాన తారాగణం మరియు సహాయ నటులు (పూర్తి క్యాస్టింగ్ పోర్ట్‌ఫోలియోతో).',
    taglineEn: 'Principal cast, lead performers, models, and character artists.',
    taglineHi: 'मुख्य कलाकार और सहायक अभिनेता।',
    subCategories: [
      { id: '3-1', nameTe: 'కథానాయకుడు', nameEn: 'Lead Actor (Hero)', nameHi: 'मुख्य अभिनेता (नायक)' },
      { id: '3-2', nameTe: 'కథానాయిక', nameEn: 'Lead Actress (Heroine)', nameHi: 'मुख्य अभिनेत्री (नायिका)' },
      { id: '3-3', nameTe: 'ప్రతినాయకుడు', nameEn: 'Antagonist (Villain)', nameHi: 'खलनायक' },
      { id: '3-4', nameTe: 'బాలనటుడు', nameEn: 'Child Artist', nameHi: 'बाल कलाकार' },
      { id: '3-5', nameTe: 'పాత్రధారులు', nameEn: 'Character Artists', nameHi: 'चरित्र कलाकार' },
      { id: '3-6', nameTe: 'అతిథి నటులు', nameEn: 'Guest / Cameo Actors', nameHi: 'अतिथि कलाकार' },
      { id: '3-7', nameTe: 'నేపథ్య నటులు', nameEn: 'Supporting / Background Actors', nameHi: 'सहायक कलाकार' },
    ],
  },
  {
    id: 4,
    code: 'CRAFT-04',
    nameTe: '4. జూనియర్ ఆర్టిస్టులు',
    nameEn: '4. Junior Artists',
    nameHi: '4. जूनियर आर्टिस्ट',
    taglineTe: 'నేపథ్యంలోని జనసమూహాలు, అదనపు పాత్రధారులు మరియు వాతావరణాన్ని సృష్టించే కళాకారులు.',
    taglineEn: 'Crowd performers, atmosphere artists, and ensemble extras.',
    taglineHi: 'पृष्ठभूमि कलाकार और भीड़ दृश्य कलाकार।',
    subCategories: [
      { id: '4-1', nameTe: 'సీనియర్ జూనియర్ ఆర్టిస్ట్ (యూనియన్)', nameEn: 'Union Junior Artist', nameHi: 'यूनियन जूनियर आर्टिस्ट' },
      { id: '4-2', nameTe: 'కాలేజ్ / యూత్ క్రౌడ్ ఆర్టిస్టులు', nameEn: 'Youth & Crowd Performers', nameHi: 'युवा भीड़ कलाकार' },
      { id: '4-3', nameTe: 'పీరియడ్ / ట్రెడిషనల్ అట్మాస్ఫియర్ ఆర్టిస్టులు', nameEn: 'Period & Cultural Atmosphere Artists', nameHi: 'पारंपरिक वातावरण कलाकार' },
    ],
  },
  {
    id: 5,
    code: 'CRAFT-05',
    nameTe: '5. డబ్బింగ్ ఆర్టిస్టులు',
    nameEn: '5. Dubbing & Voice Artists',
    nameHi: '5. डबिंग और वॉइस आर्टिस्ट',
    taglineTe: 'ప్రధాన/జూనియర్ నటుల కోసం లేదా అనువాదం కోసం పోస్ట్-ప్రొడక్షన్లో సంభాషణలను రికార్డ్ చేసే వాయిస్ నటులు.',
    taglineEn: 'Post-production voice performers and multilingual dubbing specialists.',
    taglineHi: 'पोस्ट-प्रोडक्शन संवाद और डबिंग कलाकार।',
    subCategories: [
      { id: '5-1', nameTe: 'లీడ్ మేల్ వాయిస్ ఆర్టిస్ట్', nameEn: 'Lead Male Dubbing Artist', nameHi: 'मुख्य पुरुष डबिंग कलाकार' },
      { id: '5-2', nameTe: 'లీడ్ ఫిమేల్ వాయిస్ ఆర్టిస్ట్', nameEn: 'Lead Female Dubbing Artist', nameHi: 'मुख्य महिला डबिंग कलाकार' },
      { id: '5-3', nameTe: 'మల్టీ-లాంగ్వేజ్ డబ్బింగ్ ఆర్టిస్ట్', nameEn: 'Pan-India Multilingual Voice Artist', nameHi: 'बहुभाषी डबिंग कलाकार' },
    ],
  },
  {
    id: 6,
    code: 'CRAFT-06',
    nameTe: '6. సినిమాటోగ్రఫీ విభాగం',
    nameEn: '6. Cinematography Department',
    nameHi: '6. सिनेमैटोग्राफी विभाग',
    taglineTe: 'కెమెరా ఆపరేషన్లు మరియు దృశ్య వాతావరణాన్ని నిర్వహించడం.',
    taglineEn: 'Camera operations, lens craft, and visual mood architecture.',
    taglineHi: 'कैमरा संचालन और दृश्य वातावरण।',
    subCategories: [
      { id: '6-1', nameTe: 'డైరెక్టర్ ఆఫ్ ఫోటోగ్రఫీ (DOP)', nameEn: 'Director of Photography (DOP)', nameHi: 'डायरेक्टर ऑफ फोटोग्राफी (DOP)' },
      { id: '6-2', nameTe: 'కెమెరా ఆపరేటర్', nameEn: 'Camera Operator', nameHi: 'कैमरा ऑपरेटर' },
      { id: '6-3', nameTe: 'ఫోకస్ పుల్లర్ (1వ AC)', nameEn: 'Focus Puller (1st AC)', nameHi: 'फोकस पुलर (1st AC)' },
      { id: '6-4', nameTe: 'రెండవ కెమెరా అసిస్టెంట్ (2వ AC)', nameEn: 'Second Camera Assistant (2nd AC)', nameHi: 'द्वितीय कैमरा सहायक (2nd AC)' },
      { id: '6-5', nameTe: 'క్లాపర్ లోడర్', nameEn: 'Clapper Loader / DIT', nameHi: 'क्लैपर लोडर' },
    ],
  },
  {
    id: 7,
    code: 'CRAFT-07',
    nameTe: '7. అవుట్డోర్ లైట్మ్యాన్ / ఎలక్ట్రికల్',
    nameEn: '7. Outdoor Lightmen / Electrical',
    nameHi: '7. आउटडोर लाइटमैन / इलेक्ट्रिकल',
    taglineTe: 'సెట్లో భౌతిక లైటింగ్ పరికరాలను నిర్వహించడం.',
    taglineEn: 'Rigging and managing high-voltage studio and outdoor film lighting.',
    taglineHi: 'सेट पर भौतिक प्रकाश उपकरणों का संचालन।',
    subCategories: [
      { id: '7-1', nameTe: 'గాఫర్', nameEn: 'Gaffer (Chief Lighting Technician)', nameHi: 'गैफ़र' },
      { id: '7-2', nameTe: 'బెస్ట్ బాయ్ ఎలక్ట్రిక్', nameEn: 'Best Boy Electric', nameHi: 'बेस्ट बॉय इलेक्ट्रिक' },
      { id: '7-3', nameTe: 'స్పార్క్స్ / లైట్మ్యాన్', nameEn: 'Sparks / Set Lightmen', nameHi: 'स्पार्क्स / लाइटमैन' },
    ],
  },
  {
    id: 8,
    code: 'CRAFT-08',
    nameTe: '8. అవుట్డోర్ యూనిట్ టెక్నీషియన్లు',
    nameEn: '8. Outdoor Unit Technicians',
    nameHi: '8. आउटडोर यूनिट तकनीशियन',
    taglineTe: 'లొకేషన్లో భారీ పరికరాలను నిర్వహించే ప్రత్యేక సిబ్బంది.',
    taglineEn: 'Specialized crew operating heavy camera rigs, tracks, and cranes.',
    taglineHi: 'लोकेशन पर भारी उपकरण संभालने वाले तकनीशियन।',
    subCategories: [
      { id: '8-1', nameTe: 'కీ గ్రిప్', nameEn: 'Key Grip', nameHi: 'की ग्रिप' },
      { id: '8-2', nameTe: 'డాలీ గ్రిప్స్', nameEn: 'Dolly Grips', nameHi: 'डॉली ग्रिप्स' },
      { id: '8-3', nameTe: 'జిబ్/క్రేన్ ఆపరేటర్లు', nameEn: 'Jimmy Jib / Panther Crane Operators', nameHi: 'जिब/क्रेन ऑपरेटर' },
    ],
  },
  {
    id: 9,
    code: 'CRAFT-09',
    nameTe: '9. స్టిల్ ఫోటోగ్రాఫర్',
    nameEn: '9. Still Photographer',
    nameHi: '9. स्टिल फोटोग्राफर',
    taglineTe: 'నిర్మాణ సమయంలో అధిక-నాణ్యత గల ప్రచార, తెరవెనుక మరియు కొనసాగింపు చిత్రాలను చిత్రీకరిస్తారు.',
    taglineEn: 'High-resolution publicity stills, behind-the-scenes, and continuity frames.',
    taglineHi: 'प्रचार, पर्दे के पीछे और निरंतरता फोटोग्राफी।',
    subCategories: [
      { id: '9-1', nameTe: 'పబ్లిసిటీ స్టిల్ ఫోటోగ్రాఫర్', nameEn: 'Publicity Still Photographer', nameHi: 'पब्लिसिटी स्टिल फोटोग्राफर' },
      { id: '9-2', nameTe: 'BTS / మేకింగ్ ఫోటోగ్రాఫర్', nameEn: 'Behind-The-Scenes (BTS) Photographer', nameHi: 'BTS फोटोग्राफर' },
      { id: '9-3', nameTe: 'లుక్ టెస్ట్ & పోస్టర్ ఫోటోగ్రాఫర్', nameEn: 'Look-Test & Character Still Specialist', nameHi: 'लुक टेस्ट फोटोग्राफर' },
    ],
  },
  {
    id: 10,
    code: 'CRAFT-10',
    nameTe: '10. కళా విభాగం',
    nameEn: '10. Art Department',
    nameHi: '10. कला विभाग (Art Direction)',
    taglineTe: 'సినిమా యొక్క భౌతిక ప్రపంచాన్ని నిర్మించడం.',
    taglineEn: 'Designing and constructing the physical world of the motion picture.',
    taglineHi: 'फिल्म की भौतिक दुनिया का निर्माण।',
    subCategories: [
      { id: '10-1', nameTe: 'ప్రొడక్షన్ డిజైనర్', nameEn: 'Production Designer', nameHi: 'प्रोडक्शन डिज़ाइनर' },
      { id: '10-2', nameTe: 'ఆర్ట్ డైరెక్టర్', nameEn: 'Art Director', nameHi: 'आर्ट डायरेक्टर' },
      { id: '10-3', nameTe: 'సెట్ డిజైనర్', nameEn: 'Set Designer', nameHi: 'सेट डिज़ाइनर' },
      { id: '10-4', nameTe: 'ప్రాప్ మాస్టర్', nameEn: 'Prop Master', nameHi: 'प्रॉप मास्टर' },
    ],
  },
  {
    id: 11,
    code: 'CRAFT-11',
    nameTe: '11. స్టూడియో కార్మికులు (సెట్ నిర్మాణం)',
    nameEn: '11. Studio Workers (Set Construction)',
    nameHi: '11. स्टूडियो कर्मचारी (सेट निर्माण)',
    taglineTe: 'డిజైన్లను వాస్తవ రూపంలోకి మార్చే చేతిపని.',
    taglineEn: 'Master craftsmen turning blueprints into towering studio sets.',
    taglineHi: 'डिज़ाइनों को वास्तविक सेट में बदलने वाले कारीगर।',
    subCategories: [
      { id: '11-1', nameTe: 'వడ్రంగిలు', nameEn: 'Set Carpenters', nameHi: 'बढ़ई (Carpenters)' },
      { id: '11-2', nameTe: 'పెయింటర్లు', nameEn: 'Scenic Painters', nameHi: 'पेंटर' },
      { id: '11-3', nameTe: 'మౌల్డర్లు', nameEn: 'Plaster & Fiber Moulders', nameHi: 'मोल्डर्स' },
      { id: '11-4', nameTe: 'సెట్ పెయింటర్లు', nameEn: 'Set Texture & Aging Painters', nameHi: 'सेट पेंटर' },
    ],
  },
  {
    id: 12,
    code: 'CRAFT-12',
    nameTe: '12. కాస్ట్యూమ్ డిజైనర్లు',
    nameEn: '12. Costume Designers',
    nameHi: '12. कॉस्ट्यूम डिज़ाइनर',
    taglineTe: 'కాలానికి మరియు నేపథ్యానికి అనుగుణంగా పాత్రలకు స్టైలింగ్ చేయడం.',
    taglineEn: 'Period-accurate wardrobe design, character styling, and drapery.',
    taglineHi: 'पात्रों और कालखंड के अनुसार वस्त्र डिज़ाइन।',
    subCategories: [
      { id: '12-1', nameTe: 'వార్డ్రోబ్ స్టైలిస్టులు', nameEn: 'Wardrobe Stylists', nameHi: 'वार्डरोब स्टाइलिस्ट' },
      { id: '12-2', nameTe: 'కాస్ట్యూమ్ అసిస్టెంట్లు', nameEn: 'Costume Assistants', nameHi: 'कॉस्ट्यूम असिस्टेंट' },
      { id: '12-3', nameTe: 'టైలర్లు/డ్రేపర్లు', nameEn: 'Cinema Tailors & Drapers', nameHi: 'टेलर / ड्रेपर' },
    ],
  },
  {
    id: 13,
    code: 'CRAFT-13',
    nameTe: '13. మేకప్ విభాగం',
    nameEn: '13. Make-up & Hair Department',
    nameHi: '13. मेकअप और हेयर विभाग',
    taglineTe: 'రూపాన్ని మెరుగుపరచడం మరియు కృత్రిమ అవయవాలను నిర్వహించడం.',
    taglineEn: 'Character look transformation, hair design, and prosthetic SFX.',
    taglineHi: 'रूप सज्जा और प्रोस्थेटिक मेकअप।',
    subCategories: [
      { id: '13-1', nameTe: 'కీ మేకప్ ఆర్టిస్ట్', nameEn: 'Key Make-up Artist', nameHi: 'मुख्य मेकअप आर्टिस्ट' },
      { id: '13-2', nameTe: 'హెయిర్ స్టైలిస్ట్', nameEn: 'Cinema Hair Stylist', nameHi: 'हेयर स्टाइलिस्ट' },
      { id: '13-3', nameTe: 'స్పెషల్ ఎఫెక్ట్స్ (SFX) మేకప్ ఆర్టిస్ట్', nameEn: 'Special Effects (SFX) Prosthetic Artist', nameHi: 'SFX मेकअप आर्टिस्ट' },
    ],
  },
  {
    id: 14,
    code: 'CRAFT-14',
    nameTe: '14. స్టంట్ విభాగం (యాక్షన్)',
    nameEn: '14. Stunt & Action Department',
    nameHi: '14. स्टंट और एक्शन विभाग',
    taglineTe: 'భౌతిక ఘర్షణ సన్నివేశాలను డిజైన్ చేయడం.',
    taglineEn: 'Choreographing high-impact combat, wirework, and vehicular stunts.',
    taglineHi: 'एक्शन और स्टंट दृश्यों की कोरियोग्राफी।',
    subCategories: [
      { id: '14-1', nameTe: 'స్టంట్ కోఆర్డినేటర్ / యాక్షన్ డైరెక్టర్', nameEn: 'Stunt Coordinator / Action Director', nameHi: 'स्टंट कोऑर्डिनेटर / एक्शन डायरेक्टर' },
      { id: '14-2', nameTe: 'స్టంట్ పెర్ఫార్మర్లు', nameEn: 'Stunt Performers / Fighters', nameHi: 'स्टंट परफॉर्मर' },
      { id: '14-3', nameTe: 'రిగ్గర్లు', nameEn: 'Safety Wire & Harness Riggers', nameHi: 'रिगर्स' },
    ],
  },
  {
    id: 15,
    code: 'CRAFT-15',
    nameTe: '15. నృత్య దర్శకత్వం',
    nameEn: '15. Choreography Department',
    nameHi: '15. नृत्य निर्देशन (कोरियोग्राफी)',
    taglineTe: 'పాట, నృత్యం లేదా క్లిష్టమైన సమకాలీన శారీరక కదలికలను రూపొందించడం.',
    taglineEn: 'Designing song sequences, classical & contemporary movement.',
    taglineHi: 'गीत और नृत्य अनुक्रमों की संरचना।',
    subCategories: [
      { id: '15-1', nameTe: 'నృత్య దర్శకులు', nameEn: 'Chief Choreographer', nameHi: 'मुख्य कोरियोग्राफर' },
      { id: '15-2', nameTe: 'సహాయక నృత్య దర్శకులు', nameEn: 'Assistant Choreographer', nameHi: 'सहायक कोरियोग्राफर' },
      { id: '15-3', nameTe: 'నేపథ్య నృత్యకారులు', nameEn: 'Background Dancers', nameHi: 'बैकग्राउंड डांसर' },
    ],
  },
  {
    id: 16,
    code: 'CRAFT-16',
    nameTe: '16. ఎడిటింగ్ విభాగం',
    nameEn: '16. Editing & DI / VFX Department',
    nameHi: '16. एडिटिंग और DI / VFX विभाग',
    taglineTe: 'కథా ప్రవాహాన్ని కూర్పు చేయడం.',
    taglineEn: 'Assembling narrative rhythm, color grading, and visual effects.',
    taglineHi: 'कहानी के प्रवाह का संपादन और कलर ग्रेडिंग।',
    subCategories: [
      { id: '16-1', nameTe: 'చీఫ్ ఎడిటర్', nameEn: 'Chief Film Editor', nameHi: 'मुख्य संपादक (Editor)' },
      { id: '16-2', nameTe: 'అసోసియేట్ ఎడిటర్', nameEn: 'Associate Editor', nameHi: 'एसोसिएट एडिटर' },
      { id: '16-3', nameTe: 'కలరిస్ట్ (DI)', nameEn: 'Digital Intermediate (DI) Colorist', nameHi: 'कलरिस्ट (DI)' },
      { id: '16-4', nameTe: 'VFX సూపర్వైజర్', nameEn: 'VFX Supervisor', nameHi: 'VFX सुपरवाइज़र' },
    ],
  },
  {
    id: 17,
    code: 'CRAFT-17',
    nameTe: '17. ఆడియోగ్రఫీ / సౌండ్ డిజైన్',
    nameEn: '17. Audiography / Sound Design',
    nameHi: '17. ऑडियोग्राफी / साउंड डिज़ाइन',
    taglineTe: 'ప్రేక్షకులు వినే ప్రతిదాన్ని నిర్వహించడం.',
    taglineEn: 'Sync sound, foley artistry, and Dolby Atmos theatrical mixing.',
    taglineHi: 'ध्वनि डिज़ाइन, फोली और री-रिकॉर्डिंग।',
    subCategories: [
      { id: '17-1', nameTe: 'ప్రొడక్షన్ సౌండ్ మిక్సర్', nameEn: 'Production Sound Mixer (Sync Sound)', nameHi: 'प्रोडक्शन साउंड मिक्सर' },
      { id: '17-2', nameTe: 'ఫోలీ ఆర్టిస్ట్', nameEn: 'Foley Artist', nameHi: 'फोली आर्टिस्ट' },
      { id: '17-3', nameTe: 'సౌండ్ డిజైనర్', nameEn: 'Sound Designer', nameHi: 'साउंड डिज़ाइनर' },
      { id: '17-4', nameTe: 'రీ-రికార్డింగ్ మిక్సర్', nameEn: 'Re-Recording Mixer (Atmos)', nameHi: 'री-रिकॉर्डिंग मिक्सर' },
    ],
  },
  {
    id: 18,
    code: 'CRAFT-18',
    nameTe: '18. సంగీత విభాగం',
    nameEn: '18. Music Department',
    nameHi: '18. संगीत विभाग',
    taglineTe: 'శబ్ద కథనాన్ని కూర్పు చేయడం.',
    taglineEn: 'Original score composition, lyrics, playback vocals, and orchestration.',
    taglineHi: 'संगीत निर्देशन, गीत और पार्श्व गायन।',
    subCategories: [
      { id: '18-1', nameTe: 'మ్యూజిక్ డైరెక్టర్ (కంపోజర్)', nameEn: 'Music Director (Composer)', nameHi: 'संगीत निर्देशक' },
      { id: '18-2', nameTe: 'గీత రచయిత', nameEn: 'Lyricist', nameHi: 'गीतकार' },
      { id: '18-3', nameTe: 'ప్లేబ్యాక్ గాయకులు', nameEn: 'Playback Singers', nameHi: 'पार्श्व गायक' },
      { id: '18-4', nameTe: 'ట్రాక్ ప్రోగ్రామర్లు/అరేంజర్లు', nameEn: 'Track Programmers & Arrangers', nameHi: 'ट्रैक प्रोग्रामर / अरेंजर' },
    ],
  },
  {
    id: 19,
    code: 'CRAFT-19',
    nameTe: '19. ప్రొడక్షన్ ఎగ్జిక్యూటివ్ / మేనేజ్మెంట్',
    nameEn: '19. Production Executive / Management',
    nameHi: '19. प्रोडक्शन एग्जीक्यूटिव / प्रबंधन',
    taglineTe: 'బడ్జెట్లు, షెడ్యూలింగ్ మరియు లాజిస్టికల్ వనరులను నిర్వహించడం.',
    taglineEn: 'Managing budgets, call sheets, schedules, and location logistics.',
    taglineHi: 'बजट, शेड्यूलिंग और लोकेशन प्रबंधन।',
    subCategories: [
      { id: '19-1', nameTe: 'లైన్ ప్రొడ్యూసర్', nameEn: 'Line Producer', nameHi: 'लाइन प्रोड्यूसर' },
      { id: '19-2', nameTe: 'ప్రొడక్షన్ మేనేజర్', nameEn: 'Production Manager / Controller', nameHi: 'प्रोडक्शन मैनेजर' },
      { id: '19-3', nameTe: 'లొకేషన్ మేనేజర్', nameEn: 'Location Manager', nameHi: 'लोकेशन मैनेजर' },
    ],
  },
  {
    id: 20,
    code: 'CRAFT-20',
    nameTe: '20. జూనియర్ ఆర్టిస్ట్ ఏజెంట్లు',
    nameEn: '20. Junior Artist Agents',
    nameHi: '20. जूनियर आर्टिस्ट एजेंट',
    taglineTe: 'షూట్ల కోసం బ్యాక్గ్రౌండ్ కళాకారులను వెతికి, నిర్వహించి, బుక్ చేసే కాంట్రాక్టర్లు.',
    taglineEn: 'Licensed coordinators sourcing and managing large crowd units.',
    taglineHi: 'शूट के लिए बैकग्राउंड कलाकारों के समन्वयक।',
    subCategories: [
      { id: '20-1', nameTe: 'చీఫ్ క్రౌడ్ కోఆర్డినేటర్', nameEn: 'Chief Crowd Coordinator', nameHi: 'मुख्य क्राउड कोऑर्डिनेटर' },
      { id: '20-2', nameTe: 'యూనియన్ ఏజెంట్ కాంట్రాక్టర్', nameEn: 'Union Agent Contractor', nameHi: 'यूनियन एजेंट ठेकेदार' },
      { id: '20-3', nameTe: 'రీజినల్ క్యాస్టింగ్ ఏజెంట్', nameEn: 'Regional Casting & Extra Coordinator', nameHi: 'क्षेत्रीय कास्टिंग एजेंट' },
    ],
  },
  {
    id: 21,
    code: 'CRAFT-21',
    nameTe: '21. ప్రొడక్షన్ & సెట్ అసిస్టెంట్లు',
    nameEn: '21. Production & Set Assistants',
    nameHi: '21. प्रोडक्शन और सेट सहायक',
    taglineTe: 'సెట్లో క్రమబద్ధత, ఆహారం మరియు ప్రాథమిక విభాగ సహాయాన్ని నిర్వహించడం.',
    taglineEn: 'On-set discipline, hospitality, catering coordination, and floor support.',
    taglineHi: 'सेट पर व्यवस्था, खान-पान और प्राथमिक सहायता।',
    subCategories: [
      { id: '21-1', nameTe: 'సెట్ బాయ్స్ / ఫ్లోర్ అసిస్టెంట్లు', nameEn: 'Floor & Set Assistants', nameHi: 'सेट एवं फ्लोर सहायक' },
      { id: '21-2', nameTe: 'ప్రొడక్షన్ క్యాటరింగ్ సూపర్వైజర్', nameEn: 'Production Hospitality & Mess Supervisor', nameHi: 'कैटरिंग सुपरवाइज़र' },
      { id: '21-3', nameTe: 'క్యారవాన్ & ఆర్టిస్ట్ అటెండెంట్లు', nameEn: 'Caravan & Artist Attendants', nameHi: 'कैरावैन सहायक' },
    ],
  },
  {
    id: 22,
    code: 'CRAFT-22',
    nameTe: '22. ప్రొడక్షన్ మహిళలు',
    nameEn: '22. Production Women (On-Set Care & Hospitality)',
    nameHi: '22. प्रोडक्शन महिला कर्मी',
    taglineTe: 'ప్రధానంగా సెట్లో ఆతిథ్యం, ప్రత్యేక నైపుణ్యం గల నటీనటుల సంరక్షణ, పరిశుభ్రతను పాటించడం మరియు సహాయక సేవలకు బాధ్యత వహిస్తారు.',
    taglineEn: 'Dedicated on-set hospitality, female artist care, hygiene, and support services.',
    taglineHi: 'सेट पर आतिथ्य, महिला कलाकारों की देखभाल और स्वच्छता।',
    subCategories: [
      { id: '22-1', nameTe: 'ఫిమేల్ ఆర్టిస్ట్ కేర్ ఎగ్జిక్యూటివ్', nameEn: 'Female Artist Care Executive', nameHi: 'महिला कलाकार देखभाल कर्मी' },
      { id: '22-2', nameTe: 'సెట్ హాస్పిటాలిటీ & హైజీన్ సూపర్వైజర్', nameEn: 'Set Hospitality & Hygiene Supervisor', nameHi: 'सेट स्वच्छता सुपरवाइज़र' },
      { id: '22-3', nameTe: 'కాస్ట్యూమ్ & గ్రీన్ రూమ్ సహాయకురాలు', nameEn: 'Green Room & Wardrobe Support', nameHi: 'ग्रीन रूम सहायक' },
    ],
  },
  {
    id: 23,
    code: 'CRAFT-23',
    nameTe: '23. సినిమా డ్రైవర్లు',
    nameEn: '23. Cinema Drivers & Logistics Fleet',
    nameHi: '23. सिनेमा ड्राइवर एवं वाहन लॉजिस्टिक्स',
    taglineTe: 'నటీనటులు, భారీ పరికరాలు, కెమెరాలు మరియు టెక్నికల్ వ్యాన్లను ఒక లొకేషన్ నుండి మరొక లొకేషన్ కు చేర్చడం.',
    taglineEn: 'Transporting cast caravans, camera trucks, generators, and unit vans safely.',
    taglineHi: 'कलाकारों, कैमरों और तकनीकी वैन का सुरक्षित परिवहन।',
    subCategories: [
      { id: '23-1', nameTe: 'క్యారవాన్ & ఆర్టిస్ట్ కాన్వాయ్ డ్రైవర్', nameEn: 'Luxury Caravan & Artist Convoy Driver', nameHi: 'कैरावैन ड्राइवर' },
      { id: '23-2', nameTe: 'కెమెరా & జనరేటర్ వ్యాన్ ఆపరేటర్', nameEn: 'Camera & Generator Van Driver', nameHi: 'कैमरा एवं जनरेटर वैन ड्राइवर' },
      { id: '23-3', nameTe: 'అవుట్డోర్ యూనిట్ హెవీ వెహికల్ డ్రైవర్', nameEn: 'Outdoor Unit Heavy Bus/Truck Driver', nameHi: 'भारी यूनिट वाहन ड्राइवर' },
    ],
  },
  {
    id: 24,
    code: 'CRAFT-24',
    nameTe: '24. ప్రచార రూపకర్తలు (పబ్లిసిటీ డిజైనర్లు)',
    nameEn: '24. Promotional & Publicity Designers',
    nameHi: '24. प्रचार एवं पब्लिसिटी डिज़ाइनर',
    taglineTe: 'సినిమా యొక్క ప్రారంభ ప్రజా ప్రతిబింబాన్ని రూపొందించడం.',
    taglineEn: 'Crafting first-look posters, theatrical trailers, and digital release campaigns.',
    taglineHi: 'फिल्म की पहली झलक, पोस्टर, टीज़र और डिजिटल अभियान।',
    subCategories: [
      { id: '24-1', nameTe: 'పోస్టర్ రూపకర్తలు', nameEn: 'Publicity Poster Designers', nameHi: 'पोस्टर डिज़ाइनर' },
      { id: '24-2', nameTe: 'టీజర్/ట్రైలర్ ఎడిటర్లు', nameEn: 'Teaser / Trailer Promo Editors', nameHi: 'टीज़र/ट्रेलर संपादक' },
      { id: '24-3', nameTe: 'డిజిటల్ మార్కెటింగ్ మేనేజర్లు', nameEn: 'Digital Marketing & PR Managers', nameHi: 'डिजिटल मार्केटिंग मैनेजर' },
    ],
  },
];

const TELUGU_FIRST_NAMES = [
  { en: 'Raghavendra Rao', te: 'రాఘవేంద్ర రావు', screen: 'Raghav R.' },
  { en: 'Srinivas Varma', te: 'శ్రీనివాస్ వర్మ', screen: 'Sri Varma' },
  { en: 'Ananya Reddy', te: 'అనన్య రెడ్డి', screen: 'Ananya Sitara' },
  { en: 'Karthikeya Naidu', te: 'కార్తికేయ నాయుడు', screen: 'Karthikeya N.' },
  { en: 'Prakash Goud', te: 'ప్రకాష్ గౌడ్', screen: 'Prakash G.' },
  { en: 'Harishankar Chowdary', te: 'హరిశంకర్ చౌదరి', screen: 'Hari Chowdary' },
  { en: 'Keerthana Devi', te: 'కీర్తన దేవి', screen: 'Keerthana Star' },
  { en: 'Venkatesh Murthy', te: 'వెంకటేష్ మూర్తి', screen: 'Venky M.' },
  { en: 'Rajasekhar Babu', te: 'రాజశేఖర్ బాబు', screen: 'Raja Sekhar' },
  { en: 'Divya Spandana', te: 'దివ్య స్పందన', screen: 'Divya S.' },
  { en: 'Naveen Chandra', te: 'నవీన్ చంద్ర', screen: 'Naveen C.' },
  { en: 'Mallikarjun Rao', te: 'మల్లికార్జున్ రావు', screen: 'Mallikarjun' },
];

const CITIES = [
  { city: 'Hyderabad (Jubilee Hills)', state: 'Telangana', native: 'Hyderabad, Telangana', pin: '500033' },
  { city: 'Hyderabad (Film Nagar)', state: 'Telangana', native: 'Warangal, Telangana', pin: '500096' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', native: 'Visakhapatnam, AP', pin: '530003' },
  { city: 'Vijayawada', state: 'Andhra Pradesh', native: 'Guntur, AP', pin: '520010' },
  { city: 'Tirupati', state: 'Andhra Pradesh', native: 'Chittoor, AP', pin: '517501' },
  { city: 'Chennai', state: 'Tamil Nadu', native: 'Chennai, TN', pin: '600026' },
];

const NOTABLE_PROJECTS = [
  'Devara, Kalki 2898 AD, Salaar',
  'RRR, Pushpa: The Rule, Dasara',
  'Hanu-Man, Hi Nanna, Balagam',
  'Major, Sita Ramam, Virupaksha',
  'Bhagavanth Kesari, Waltair Veerayya, Bro',
  'DJ Tillu Square, Committee Kurrollu, Mathu Vadalara 2',
];

const INDUSTRY_SETS = [
  ['Tollywood (Telugu)', 'Pan-India / International'],
  ['Tollywood (Telugu)', 'Kollywood (Tamil)', 'Bollywood (Hindi)'],
  ['Tollywood (Telugu)', 'Sandalwood (Kannada)', 'Mollywood (Malayalam)'],
];

/**
 * Generates an inline SVG Data URI for portfolio gallery thumbnails so up to 25 photos work offline with zero broken links.
 */
export function makePortfolioPhotoSvgDataUri(label: string, index: number): string {
  const colors = ['#F2B705', '#38BDF8', '#F43F5E', '#34D399', '#A78BFA', '#FBBF24'];
  const c = colors[index % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
    <rect width="400" height="500" fill="#121215"/>
    <circle cx="200" cy="185" r="78" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2"/>
    <circle cx="200" cy="165" r="34" fill="none" stroke="${c}" stroke-width="2.5"/>
    <path d="M135 245 C135 200, 265 200, 265 245" fill="none" stroke="${c}" stroke-width="2.5"/>
    <rect x="24" y="24" width="352" height="452" rx="14" fill="none" stroke="#27272A" stroke-width="2"/>
    <text x="200" y="345" text-anchor="middle" fill="#FAFAFA" font-family="sans-serif" font-weight="700" font-size="18">${label.replace(/[<>&"']/g, '')}</text>
    <text x="200" y="378" text-anchor="middle" fill="${c}" font-family="monospace" font-size="13">PORTFOLIO STILL #${index + 1} / 25</text>
    <text x="200" y="430" text-anchor="middle" fill="#71717A" font-family="monospace" font-size="11">24CROFTS.COM VERIFIED GALLERY</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildCastingDetailsForProfile(
  fullName: string,
  screenName: string,
  city: string,
  expYears: number,
  languages: string[],
  seq: number
): CastingProfileDetails {
  const isFemale = seq % 2 === 1;
  return {
    fullName,
    screenName,
    age: 22 + (seq % 14),
    city,
    height: isFemale ? `5'6" (168 cm)` : `5'11" (180 cm)`,
    weight: isFemale ? '54 kg' : '74 kg',
    bust: isFemale ? '34 in' : '40 in (Chest)',
    waist: isFemale ? '26 in' : '32 in',
    hip: isFemale ? '36 in' : '38 in',
    skinTone: seq % 3 === 0 ? 'Wheatish Warm' : 'Fair / Golden Olive',
    eyeColour: 'Dark Brown',
    hairColour: 'Natural Jet Black',
    shoeSize: isFemale ? 'UK 5 / EU 38' : 'UK 9 / EU 43',
    maritalStatus: seq % 2 === 0 ? 'Unmarried / Single' : 'Married',
    presentProfession: 'Film Actor, Model & Theatre Performer',
    education: 'B.Tech & Diploma in Method Acting (Annapurna Film School)',
    dressesComfortable: 'Indian Traditional, Ethnic, Western, Designer & Character Costumes',
    openForOutstationShoots: 'Yes',
    openForOutOfCountryShoots: 'Yes',
    passport: 'Available',
    experience: `${expYears} Years in Feature Films, Commercials & OTT Series`,
    comfortableWithAllTimings: 'Yes',
    languages,
    interestedIn: [
      '1. Acting',
      '2. Print shoots',
      '3. Ramp shows',
      '4. Designer shoots',
      '5. Ethnic wears',
      '6. Western wears',
      '10. Calendar shoots',
      '11. Music Albums',
    ],
    aim: 'To deliver memorable lead and character performances across Pan-India cinema (Tollywood, Kollywood, Bollywood).',
    comfortableWithScenes: [
      'C). Hug scenes',
      'Indian wears',
      'Western wears',
      'Skirts',
      'Shorts',
      'Driving scenes',
      'Able to work Indoor & Outdoor',
    ],
    allergiesToDustOrCosmetics: 'No allergies to studio dust, prosthetic adhesives, or HD makeup cosmetics.',
    instagramId: `@${screenName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_24c`,
  };
}

function buildInitialProfiles(): CraftProfile[] {
  const list: CraftProfile[] = [];
  let seq = 1001;
  const baseTimestamp = 1792700000000;

  for (const craft of TWENTY_FOUR_CRAFTS) {
    for (let idx = 0; idx < 3; idx++) {
      const subCat = craft.subCategories[idx % craft.subCategories.length];
      const namePair = TELUGU_FIRST_NAMES[(craft.id * 3 + idx) % TELUGU_FIRST_NAMES.length];
      const loc = CITIES[(craft.id + idx) % CITIES.length];
      const id = `24C-${seq}`;
      const rawAadhaar = `${4000 + craft.id}${1000 + idx * 111}${seq}`;
      const { aadhaarMasked, aadhaarCiphertext } = encryptAndMaskAadhaar(rawAadhaar);
      const isPaidMember = idx === 0 || idx === 2;
      const isDailyUpload = idx === 0 || (craft.id <= 4 && idx === 1);
      const expYears = 4 + ((craft.id + idx * 3) % 14);
      const languages = ['Telugu (తెలుగు)', 'English', idx % 2 === 0 ? 'Hindi (हिन्दी)' : 'Tamil (தமிழ்)'];
      const industries = INDUSTRY_SETS[(craft.id + idx) % INDUSTRY_SETS.length];

      // Give clear, memorable login User IDs for quick testing
      const userId =
        seq === 1001
          ? 'karthikeya1001'
          : seq === 1007
          ? 'ananya1007'
          : `user_${seq}`;

      const photoGallery = Array.from({ length: 6 }, (_, pIdx) =>
        makePortfolioPhotoSvgDataUri(`${namePair.en}`, pIdx)
      );

      list.push({
        id,
        userId,
        password: 'Cinema@123',
        name: `${namePair.en} (${subCat.nameEn.split(' ')[0]})`,
        nameTe: `${namePair.te}`,
        categoryId: craft.id,
        subCategoryId: subCat.id,
        subCategoryNameTe: subCat.nameTe,
        subCategoryNameEn: subCat.nameEn,
        experienceYears: expYears,
        city: loc.city,
        addressDetails: {
          houseOrStreet: `Plot No. ${seq - 980}, Road No. ${(craft.id * 3) % 80 + 1}`,
          areaOrLocality: 'Film Nagar / Jubilee Hills',
          city: loc.city,
          districtOrState: loc.state,
          pincode: loc.pin,
          nativePlace: loc.native,
        },
        industries,
        languages,
        notableWorks: NOTABLE_PROJECTS[(craft.id + idx) % NOTABLE_PROJECTS.length],
        bioTe: `${craft.nameTe}లో ${subCat.nameTe}గా 24crofts.com ధృవీకరించిన ప్రొఫైల్. ${industries.join(', ')} సినిమాలలో అనుభవం.`,
        bioEn: `Verified ${subCat.nameEn} in ${craft.nameEn} working across ${industries.join(', ')}. Available for feature films and OTT originals.`,
        isPaidMember,
        isDailyUpload,
        createdAtTimestamp:
          baseTimestamp + (72 - (seq - 1001)) * 60000 + (isDailyUpload ? 50000000 : 0),
        createdDateLabel: isDailyUpload ? 'Today · Daily Upload' : `${idx + 1}d ago`,
        phone: `+91 9848${String(seq).padStart(4, '0')}${idx}2`,
        email: `craft.${id.toLowerCase()}@24crofts.com`,
        aadhaarMasked,
        aadhaarCiphertext,
        youtubeShowreelUrl: 'https://www.youtube.com/watch?v=ePOglweqy7o',
        youtubeLinks: [
          'https://www.youtube.com/watch?v=ePOglweqy7o',
          'https://www.youtube.com/watch?v=ddbL9jvgTlA',
          'https://www.youtube.com/watch?v=K4DyBUG242c',
        ],
        photoGallery,
        castingDetails: buildCastingDetailsForProfile(
          namePair.en,
          namePair.screen,
          loc.city,
          expYears,
          languages,
          seq
        ),
        verifiedByAdmin: true,
        remunerationRange: isPaidMember
          ? '₹25,000 – ₹1,50,000 / schedule'
          : 'As per Federation Norms',
        availabilityStatus: idx === 1 ? 'In Discussions' : 'Available',
        avatarTheme: (craft.id + idx) % 6,
        profileViews: 340 + craft.id * 29 + idx * 45,
        shortlistCount: 12 + (craft.id % 9) + idx * 4,
      });

      seq++;
    }
  }

  return list;
}

export const INITIAL_PROFILES: CraftProfile[] = buildInitialProfiles();

export const INITIAL_ADS: CinemaAdItem[] = [
  {
    id: 'TEASER-01',
    titleTe: 'రుద్రమహాదేవి: ది ఎంపైర్ — అధికారిక 4K టీజర్',
    titleEn: 'Rudramahadevi: The Empire — Official 4K Teaser',
    bannerOrClient: 'Vyjayanthi Entertainments',
    adType: 'teaser',
    mediaSubType: 'Movie Teaser',
    youtubeUrl: 'https://www.youtube.com/watch?v=ePOglweqy7o',
    priorityOrder: 1,
    status: 'approved',
    submittedAt: 'Today, 09:15 AM',
    viewsCount: 148200,
    artworkVariant: 0,
  },
  {
    id: 'TEASER-02',
    titleTe: 'హైదరాబాద్ నైట్స్ — థ్రిల్లర్ గ్లింప్స్ & ట్రైలర్',
    titleEn: 'Hyderabad Nights — Action Thriller Glimpse',
    bannerOrClient: 'Mythri Film Makers',
    adType: 'teaser',
    mediaSubType: 'Movie Trailer',
    youtubeUrl: 'https://www.youtube.com/watch?v=ddbL9jvgTlA',
    priorityOrder: 2,
    status: 'approved',
    submittedAt: 'Today, 10:30 AM',
    viewsCount: 96400,
    artworkVariant: 1,
  },
  {
    id: 'TEASER-03',
    titleTe: 'నీలి మేఘమాల — మెలోడీ లిరికల్ సాంగ్ ప్రోమో',
    titleEn: 'Neeli Meghamala — 4K Lyrical Song Promo',
    bannerOrClient: 'Sithara Entertainments',
    adType: 'teaser',
    mediaSubType: 'Lyrical Song',
    youtubeUrl: 'https://www.youtube.com/watch?v=K4DyBUG242c',
    priorityOrder: 3,
    status: 'approved',
    submittedAt: 'Today, 11:05 AM',
    viewsCount: 84150,
    artworkVariant: 2,
  },
  {
    id: 'TEASER-04',
    titleTe: 'అగ్నిपथ్: చాప్టర్ 2 — పాన్ ఇండియా టీజర్',
    titleEn: 'Agnipath: Chapter 2 — Pan-India Teaser',
    bannerOrClient: 'Geetha Arts Digital',
    adType: 'teaser',
    mediaSubType: 'Movie Teaser',
    youtubeUrl: 'https://www.youtube.com/watch?v=1VIZ89FEjYI',
    priorityOrder: 4,
    status: 'approved',
    submittedAt: 'Yesterday',
    viewsCount: 72300,
    artworkVariant: 3,
  },
  {
    id: 'TEASER-05',
    titleTe: 'గోదావరి గాలి — ఫోక్ సాంగ్ వీడియో ప్రోమో',
    titleEn: 'Godavari Gaali — Folk Single Video Promo',
    bannerOrClient: 'SVC Creations',
    adType: 'teaser',
    mediaSubType: 'Lyrical Song',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    priorityOrder: 5,
    status: 'approved',
    submittedAt: 'Yesterday',
    viewsCount: 61900,
    artworkVariant: 4,
  },
  {
    id: 'TEASER-06',
    titleTe: 'సైబర్ సెల్ 2027 — సైన్స్ ఫిక్షన్ టీజర్',
    titleEn: 'Cyber Cell 2027 — Sci-Fi Feature Teaser',
    bannerOrClient: 'Annapurna Studios',
    adType: 'teaser',
    mediaSubType: 'Movie Teaser',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    priorityOrder: 6,
    status: 'approved',
    submittedAt: '2 days ago',
    viewsCount: 53400,
    artworkVariant: 5,
  },
  {
    id: 'PVT-01',
    titleTe: 'అన్నపూర్ణ 7 ఎకర్స్ — 8K LED వర్చువల్ ప్రొడక్షన్ ఫ్లోర్',
    titleEn: 'Annapurna 7 Acres — 8K Virtual Production Volume Stage',
    bannerOrClient: 'Annapurna Studios Pvt Ltd',
    adType: 'pvt',
    mediaSubType: 'Pvt Commercial',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    priorityOrder: 1,
    status: 'approved',
    submittedAt: 'Today',
    viewsCount: 31200,
    artworkVariant: 1,
  },
  {
    id: 'PVT-02',
    titleTe: 'ARRI Alexa 35 & Cooke Anamorphic లెన్స్ రెంటల్ హబ్',
    titleEn: 'ARRI Alexa 35 & Cooke Anamorphic Rental Hub Hyderabad',
    bannerOrClient: 'Deccan Cine Rentals Film Nagar',
    adType: 'pvt',
    mediaSubType: 'Pvt Commercial',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    priorityOrder: 2,
    status: 'approved',
    submittedAt: 'Today',
    viewsCount: 24800,
    artworkVariant: 2,
  },
  {
    id: 'PVT-03',
    titleTe: 'రామోజీ ఫిల్మ్ సిటీ — పీరియడ్ సెట్స్ & అవుట్డోర్ ప్యాకేజీలు',
    titleEn: 'Ramoji Film City — Period Sets & Turnkey Shoot Packages',
    bannerOrClient: 'Ramoji Film City Hospitality',
    adType: 'pvt',
    mediaSubType: 'Pvt Commercial',
    youtubeUrl: 'https://www.youtube.com/watch?v=ePOglweqy7o',
    priorityOrder: 3,
    status: 'approved',
    submittedAt: 'Yesterday',
    viewsCount: 19400,
    artworkVariant: 3,
  },
  {
    id: 'PVT-04',
    titleTe: 'ప్రసాద్ ల్యాబ్స్ — Dolby Atmos & Baselight DI గ్రేడింగ్ సూట్',
    titleEn: 'Prasad Labs — Dolby Atmos & Baselight 8K DI Suite',
    bannerOrClient: 'Prasad EFX Hyderabad',
    adType: 'pvt',
    mediaSubType: 'Pvt Commercial',
    youtubeUrl: 'https://www.youtube.com/watch?v=K4DyBUG242c',
    priorityOrder: 4,
    status: 'approved',
    submittedAt: 'Yesterday',
    viewsCount: 17100,
    artworkVariant: 4,
  },
  {
    id: 'PVT-05',
    titleTe: 'తెలుగు సినీ లగ్జరీ క్యారవాన్స్ & మేకప్ వ్యాన్స్',
    titleEn: 'StarFlix Luxury Dual-Suite Artist Caravans',
    bannerOrClient: 'StarFlix Fleet Jubilee Hills',
    adType: 'pvt',
    mediaSubType: 'Pvt Commercial',
    youtubeUrl: 'https://www.youtube.com/watch?v=1VIZ89FEjYI',
    priorityOrder: 5,
    status: 'approved',
    submittedAt: '2 days ago',
    viewsCount: 14900,
    artworkVariant: 5,
  },
  {
    id: 'PVT-06',
    titleTe: 'సినీ ఇన్సూరెన్స్ & ప్రొడక్షన్ ఫైనాన్స్ అడ్వైజరీ',
    titleEn: 'CineShield Film Completion Bond & Equipment Insurance',
    bannerOrClient: 'CineShield FinCorp India',
    adType: 'pvt',
    mediaSubType: 'Pvt Commercial',
    youtubeUrl: 'https://www.youtube.com/watch?v=ddbL9jvgTlA',
    priorityOrder: 6,
    status: 'approved',
    submittedAt: '3 days ago',
    viewsCount: 12300,
    artworkVariant: 0,
  },
  {
    id: 'SPL-01',
    titleTe: 'మెగా పాన్-ఇండియా మూవీ క్యాస్టింగ్ కాల్ — కొత్త నటీనటులు కావాలి',
    titleEn: 'Mega Pan-India Casting Call — Lead & Character Roles',
    bannerOrClient: 'Suresh Productions (Verified)',
    adType: 'special',
    mediaSubType: 'Special Casting Ad',
    youtubeUrl: 'https://www.youtube.com/watch?v=ePOglweqy7o',
    priorityOrder: 1,
    status: 'approved',
    submittedAt: 'Today',
    viewsCount: 88500,
    artworkVariant: 2,
  },
  {
    id: 'SPL-02',
    titleTe: 'చారిత్రాత్మక చిత్రానికి 250 మంది జూనియర్ & ఫైటర్ ఆర్టిస్టులు కావాలి',
    titleEn: 'Period Action Film Requires 250 Fighters & Crowd Artists',
    bannerOrClient: 'Haarika & Hassine Creations',
    adType: 'special',
    mediaSubType: 'Special Casting Ad',
    youtubeUrl: 'https://www.youtube.com/watch?v=ddbL9jvgTlA',
    priorityOrder: 2,
    status: 'approved',
    submittedAt: 'Today',
    viewsCount: 64200,
    artworkVariant: 3,
  },
  {
    id: 'SPL-03',
    titleTe: 'OTT వెబ్ సిరీస్ సీజన్ 3 — రచయితలు & అసోసియేట్ డైరెక్టర్స్ ఆహ్వానం',
    titleEn: 'Telugu Thriller OTT Series — Screenwriters & ADs Wanted',
    bannerOrClient: 'Aha / Arka Media Works',
    adType: 'special',
    mediaSubType: 'Special Casting Ad',
    youtubeUrl: 'https://www.youtube.com/watch?v=K4DyBUG242c',
    priorityOrder: 3,
    status: 'approved',
    submittedAt: 'Yesterday',
    viewsCount: 51900,
    artworkVariant: 4,
  },
  {
    id: 'SPL-04',
    titleTe: 'అవుట్డోర్ నైట్ షూట్ కోసం జిమ్మీ జిబ్ & పాంథర్ క్రేన్ ఆపరేటర్లు',
    titleEn: '45-Day Night Schedule — Jib & Panther Crane Crew Needed',
    bannerOrClient: 'UV Creations Unit 2',
    adType: 'special',
    mediaSubType: 'Studio Equipment Ad',
    youtubeUrl: 'https://www.youtube.com/watch?v=1VIZ89FEjYI',
    priorityOrder: 4,
    status: 'approved',
    submittedAt: 'Yesterday',
    viewsCount: 39800,
    artworkVariant: 5,
  },
  {
    id: 'SPL-05',
    titleTe: '5 భాషల డబ్బింగ్ కోసం ఫీమేల్ & చైల్డ్ వాయిస్ ఆర్టిస్టుల ఆడిషన్స్',
    titleEn: '5-Language Dubbing Auditions — Female & Child Voice Artists',
    bannerOrClient: 'Rama Naidu Recording Studios',
    adType: 'special',
    mediaSubType: 'Special Casting Ad',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    priorityOrder: 5,
    status: 'approved',
    submittedAt: '2 days ago',
    viewsCount: 34100,
    artworkVariant: 0,
  },
  {
    id: 'SPL-06',
    titleTe: 'సెట్ నిర్మాణం కోసం 60 మంది స్టూడియో కార్పెంటర్లు & మౌల్డర్లు కావాలి',
    titleEn: 'Immediate Requirement: 60 Set Carpenters & Fiber Moulders',
    bannerOrClient: 'Saradhi Studios Set Division',
    adType: 'special',
    mediaSubType: 'Special Casting Ad',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    priorityOrder: 6,
    status: 'approved',
    submittedAt: '2 days ago',
    viewsCount: 28700,
    artworkVariant: 1,
  },
  {
    id: 'TEASER-07',
    titleTe: 'దేవరకొండ కోట రహస్యం — కొత్త మూవీ టీజర్ (అడ్మిన్ ఆమోదం కోసం)',
    titleEn: 'Devarakonda Fort Mystery — New Teaser (Awaiting Admin Approval)',
    bannerOrClient: 'Niharika Entertainments',
    adType: 'teaser',
    mediaSubType: 'Movie Teaser',
    youtubeUrl: 'https://www.youtube.com/watch?v=ePOglweqy7o',
    priorityOrder: 1,
    status: 'pending',
    submittedAt: 'Just now',
    viewsCount: 0,
    artworkVariant: 2,
  },
  {
    id: 'SPL-07',
    titleTe: 'కొత్త మ్యూజికల్ లవ్ స్టోరీ — హీరోయిన్ & కొరియోగ్రాఫర్ ఆడిషన్స్',
    titleEn: 'New Musical Feature — Lead Actress & Choreographer Auditions',
    bannerOrClient: 'Shine Screens Banner',
    adType: 'special',
    mediaSubType: 'Special Casting Ad',
    youtubeUrl: 'https://www.youtube.com/watch?v=K4DyBUG242c',
    priorityOrder: 1,
    status: 'pending',
    submittedAt: '12 mins ago',
    viewsCount: 0,
    artworkVariant: 4,
  },
];

export const INITIAL_CONTACT_REQUESTS: ContactAccessRequest[] = [
  {
    id: 'REQ-501',
    productionHouseId: 'PH-101',
    productionHouseName: 'Mythri Film Makers',
    producerName: 'Naveen Yerneni',
    movieTitle: 'Production No. 18 (Pan-India Action)',
    movieRegCertNumber: 'TFCC/REG/2026/0892',
    targetProfileId: '24C-1001',
    targetProfileName: 'Karthikeya Naidu (Main Director)',
    targetCraftName: '1. దర్శకత్వ విభాగం',
    status: 'approved',
    requestedAt: '2026-10-22 08:30',
  },
  {
    id: 'REQ-502',
    productionHouseId: 'PH-101',
    productionHouseName: 'Mythri Film Makers',
    producerName: 'Naveen Yerneni',
    movieTitle: 'Production No. 18 (Pan-India Action)',
    movieRegCertNumber: 'TFCC/REG/2026/0892',
    targetProfileId: '24C-1002',
    targetProfileName: 'Prakash Goud (Co-Director)',
    targetCraftName: '1. దర్శకత్వ విభాగం',
    status: 'pending',
    requestedAt: '2026-10-22 10:15',
  },
  {
    id: 'REQ-503',
    productionHouseId: 'PH-102',
    productionHouseName: 'Vyjayanthi Movies',
    producerName: 'C. Aswani Dutt',
    movieTitle: 'Project-K Sequel Unit',
    movieRegCertNumber: 'TFCC/REG/2026/0914',
    targetProfileId: '24C-1007',
    targetProfileName: 'Ananya Reddy (Lead Actor/Actress)',
    targetCraftName: '3. సినీ కళాకారులు (నటీనటులు / క్యాస్టింగ్)',
    status: 'approved',
    requestedAt: '2026-10-22 11:40',
  },
];

export const INITIAL_PRODUCTION_HOUSES: ProductionHouseRecord[] = [
  {
    id: 'PH-101',
    userId: 'mythri101',
    password: 'Studio@123',
    bannerName: 'Mythri Film Makers',
    producerName: 'Naveen Yerneni',
    gstOrCin: '36AABCM4829K1Z5',
    aadhaarMasked: 'XXXX-XXXX-8921',
    aadhaarCiphertext: 'E2E-AES256-GCM:98F12B4C:IV94A2',
    movieTitle: 'Production No. 18 (Pan-India Action)',
    movieRegistrationFileName: 'TFCC_Movie_Registration_Mythri_18.pdf',
    phone: '+91 98480 11223',
    email: 'casting@mythrifilms.in',
    city: 'Jubilee Hills, Hyderabad',
    addressDetails: {
      houseOrStreet: 'Plot 214, Road No. 45',
      areaOrLocality: 'Jubilee Hills',
      city: 'Hyderabad',
      districtOrState: 'Telangana',
      pincode: '500033',
      nativePlace: 'Hyderabad, Telangana',
    },
    industries: ['Tollywood (Telugu)', 'Kollywood (Tamil)', 'Bollywood (Hindi)', 'Pan-India / International'],
    languages: ['Telugu (తెలుగు)', 'English', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)'],
    status: 'approved',
    createdAt: '2026-10-18',
  },
  {
    id: 'PH-102',
    userId: 'vyjayanthi102',
    password: 'Studio@123',
    bannerName: 'Vyjayanthi Movies',
    producerName: 'C. Aswani Dutt',
    gstOrCin: '36AAACV1920P1Z8',
    aadhaarMasked: 'XXXX-XXXX-4410',
    aadhaarCiphertext: 'E2E-AES256-GCM:77A09E21:IV94A2',
    movieTitle: 'Project-K Sequel Unit',
    movieRegistrationFileName: 'TFCC_Movie_Registration_Vyjayanthi.pdf',
    phone: '+91 98480 55667',
    email: 'production@vyjayanthi.com',
    city: 'Banjara Hills, Hyderabad',
    addressDetails: {
      houseOrStreet: 'Road No. 2, Banjara Hills',
      areaOrLocality: 'Film Nagar',
      city: 'Hyderabad',
      districtOrState: 'Telangana',
      pincode: '500034',
      nativePlace: 'Vijayawada, Andhra Pradesh',
    },
    industries: ['Tollywood (Telugu)', 'Bollywood (Hindi)', 'Pan-India / International'],
    languages: ['Telugu (తెలుగు)', 'English', 'Hindi (हिन्दी)'],
    status: 'approved',
    createdAt: '2026-10-20',
  },
];

export const MAIN_SITE_LOGO_URL =
  '/assets/aistudio/Gemini_Generated_Image_txrss8txrss8txrs__1__b367eb38.png';

export interface AdsenseSlotUnit {
  id: string;
  slotName: string;
  placement: 'home_mid' | 'home_bottom' | 'directory_top' | 'custom_banner';
  adClient: string;
  adSlotId: string;
  adFormat: string;
  adCodeSnippet: string;
  headlineText: string;
  enabled: boolean;
}

export interface SiteCmsConfig {
  siteDomain: string;
  siteLogoUrl: string;
  heroHeadlineTe: string;
  heroHeadlineEn: string;
  heroSublineTe: string;
  heroSublineEn: string;
  contactEmail: string;
  contactMobile: string;
  contactLocation: string;
  adsensePublisherId: string;
  adsenseDashboardUrl: string;
  adsenseAutoAdsEnabled: boolean;
  adsenseGlobalScriptCode: string;
  adsenseSlots: AdsenseSlotUnit[];
  encryptionStandard: string;
  announcementBannerTe: string;
}

export const INITIAL_CMS_CONFIG: SiteCmsConfig = {
  siteDomain: '24crofts.com',
  siteLogoUrl: MAIN_SITE_LOGO_URL,
  heroHeadlineTe: 'భారతీయ సినిమా 24 విభాగాల అధికారిక క్యాస్టింగ్ & ప్రొడక్షన్ వేదిక',
  heroHeadlineEn: 'The Official Casting & Production Platform for All 24 Cinema Crafts',
  heroSublineTe: 'అడ్మిన్ టీమ్ ఆమోదంతో మాత్రమే ప్రొడక్షన్ హౌస్ వారికి కాంటాక్ట్ నంబర్లు కనిపిస్తాయి. 25 ఫోటోల గ్యాలరీ, అపరిమిత యూట్యూబ్ లింక్స్, పూర్తి క్యాస్టింగ్ పోర్ట్‌ఫోలియో మరియు E2E ఆధార్ భద్రత.',
  heroSublineEn: 'Strict Admin-verified Contact Privacy for Production Houses, up to 25 portfolio photos, unlimited YouTube showreel links, full casting measurements sheet, and AES-256 encrypted Aadhaar.',
  contactEmail: '24croftsindia@gmail.com',
  contactMobile: '7989144860',
  contactLocation: 'Film Nagar, Jubilee Hills, Hyderabad, Telangana, India',
  adsensePublisherId: 'ca-pub-2489104279891448',
  adsenseDashboardUrl: 'https://www.google.com/adsense/new/u/0/pub-2489104279891448/home',
  adsenseAutoAdsEnabled: true,
  adsenseGlobalScriptCode: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2489104279891448" crossorigin="anonymous"></script>`,
  adsenseSlots: [
    {
      id: 'adsense-slot-1',
      slotName: 'Home Page Mid Banner Ad Unit',
      placement: 'home_mid',
      adClient: 'ca-pub-2489104279891448',
      adSlotId: '9012489101',
      adFormat: 'auto',
      headlineText:
        'Hyderabad Film Equipment, Post-Production DI Suites & Studio Floor Bookings — Verified Partners',
      adCodeSnippet: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2489104279891448" data-ad-slot="9012489101" data-ad-format="auto" data-full-width-responsive="true"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
      enabled: true,
    },
    {
      id: 'adsense-slot-2',
      slotName: '24 Crafts Directory Bottom Display Unit',
      placement: 'home_bottom',
      adClient: 'ca-pub-2489104279891448',
      adSlotId: '9022489102',
      adFormat: 'horizontal',
      headlineText:
        'Pan-India Audition Studios, Costume Rentals, ARRI/RED Camera Rentals & Outdoor Unit Services',
      adCodeSnippet: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2489104279891448" data-ad-slot="9022489102" data-ad-format="horizontal" data-full-width-responsive="true"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
      enabled: true,
    },
  ],
  encryptionStandard: 'AES-256-GCM End-to-End Field Encryption + TLS 1.3',
  announcementBannerTe: 'రోజువారీ కొత్త ప్రొఫైల్ అప్లోడ్లకు మొదటి ప్రాధాన్యత · 25 ఫోటోల అప్లోడ్ & అపరిమిత యూట్యూబ్ లింక్స్ · ప్రొఫైల్ ఎడిట్ లాగిన్ సదుపాయం',
};

export interface HostingEstimateItem {
  id: string;
  componentTe: string;
  componentEn: string;
  spec: string;
  monthlyInr: number;
  annualInr: number;
  notesTe: string;
}

export const HOSTING_ESTIMATE_ITEMS: HostingEstimateItem[] = [
  {
    id: 'cloud-compute',
    componentTe: 'క్లౌడ్ అప్లికేషన్ సర్వర్ హోస్టింగ్ (AWS Mumbai / GCP)',
    componentEn: 'Cloud Application Server Hosting (Auto-Scaling Nodes)',
    spec: '4 vCPU, 16 GB RAM, Load Balancer, Multi-AZ High Availability',
    monthlyInr: 6500,
    annualInr: 72000,
    notesTe: 'రోజువారీ వేలాది ప్రొఫైల్ సెర్చ్‌లు మరియు ట్రాఫిక్ తట్టుకునేలా 99.95% అప్‌టైమ్.',
  },
  {
    id: 'db-security',
    componentTe: 'ఎన్క్రిప్టెడ్ డేటాబేస్ & ఆధార్ E2E వాల్ట్ (AES-256-GCM)',
    componentEn: 'Managed PostgreSQL + KMS Aadhaar E2E Encryption Vault',
    spec: 'Automated Daily Backups, Point-in-Time Recovery, WAF Firewall',
    monthlyInr: 4200,
    annualInr: 48000,
    notesTe: 'ఆధార్ మరియు కాంటాక్ట్ నంబర్ల భద్రత కోసం ఎండ్-టు-ఎండ్ ఎన్క్రిప్షన్ మరియు కీ మేనేజ్మెంట్.',
  },
  {
    id: 'cdn-media',
    componentTe: 'హై-స్పీడ్ 25-ఫోటో గ్యాలరీ స్టోరేజ్ & CDN',
    componentEn: 'Object Storage (S3/Cloud Storage) + Global CDN + SSL',
    spec: '1 TB Portfolio Photos (25/profile), PDF Movie Certificates & Fast Delivery',
    monthlyInr: 2300,
    annualInr: 26000,
    notesTe: 'ప్రతి ప్రొఫైల్‌కు 25 ఫోటోలు మరియు ప్రొడక్షన్ హౌస్ మూవీ రిజిస్ట్రేషన్ సర్టిఫికెట్ల సురక్షిత నిల్వ.',
  },
  {
    id: 'mobile-stores',
    componentTe: 'iOS (Apple App Store) & Android (Google Play) డెవలపర్ ఖాతాలు + Push Notifications',
    componentEn: 'iOS App Store + Android Play Console + FCM Push Service',
    spec: 'Apple Developer ($99/yr) + Google Play + Unlimited Push Alerts',
    monthlyInr: 1200,
    annualInr: 14000,
    notesTe: 'ఐఓఎస్ మరియు ఆండ్రాయిడ్ యాప్ స్టోర్ మెయింటెనెన్స్ మరియు మొబైల్ నోటిఫికేషన్లు.',
  },
  {
    id: 'maintenance-amc',
    componentTe: 'సర్వర్ మెయింటెనెన్స్, సెక్యూరిటీ ప్యాచెస్ & 24/7 మానిటరింగ్',
    componentEn: 'DevOps Maintenance, Security Audits & Backup Monitoring',
    spec: 'Monthly Security Patching, Database Optimization & Admin Support',
    monthlyInr: 5000,
    annualInr: 55000,
    notesTe: 'నిరంతర భద్రతా తనిఖీలు, సాఫ్ట్‌వేర్ అప్‌డేట్లు మరియు టెక్నికల్ సపోర్ట్.',
  },
];
