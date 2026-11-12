// Canonical TNPSC Combined Civil Services Examination - IV (Group IV) Syllabus

const examData = {
  name: 'TNPSC Combined Civil Services Examination – IV (Group IV Services)',
  code: 'TNPSC_GROUP_IV',
  description: 'Official syllabus based on TNPSC notification for Combined Civil Services Examination IV (Group IV Services).',
  isActive: true
};

const syllabusStructure = [
  {
    code: 'A',
    name: 'Part A: General Studies',
    language: 'English',
    questionWeightage: 75,
    displayOrder: 1,
    units: [
      {
        code: 'Unit I',
        name: 'General Science',
        questionWeightage: 5,
        displayOrder: 1,
        topics: [
          { slug: 'nature-of-universe', name: 'Nature of Universe' },
          { slug: 'measurement-physical-quantities', name: 'Measurement of physical quantities' },
          { slug: 'scientific-laws-motion', name: 'General scientific laws in motion' },
          { slug: 'force-pressure-energy', name: 'Force, pressure and energy' },
          { slug: 'everyday-physics', name: 'Everyday applications of mechanics, electricity, magnetism, light, sound, heat and nuclear physics' },
          { slug: 'elements-compounds', name: 'Elements and compounds' },
          { slug: 'acids-bases-salts', name: 'Acids, bases and salts' },
          { slug: 'petroleum-fertilizers-pesticides', name: 'Petroleum products, fertilizers and pesticides' },
          { slug: 'metallurgy-food-adulterants', name: 'Metallurgy and food adulterants' },
          { slug: 'concepts-life-science', name: 'Main concepts of life science' },
          { slug: 'classification-organisms', name: 'Classification of living organisms' },
          { slug: 'evolution-genetics', name: 'Evolution and genetics' },
          { slug: 'physiology-nutrition-health', name: 'Physiology, nutrition, health and hygiene' },
          { slug: 'human-diseases', name: 'Human diseases' },
          { slug: 'environmental-science', name: 'Environmental science' },
          { slug: 'latest-inventions-sci-tech', name: 'Latest inventions in science and technology' },
          { slug: 'science-current-affairs', name: 'Current affairs in Science' }
        ]
      },
      {
        code: 'Unit II',
        name: 'Geography',
        questionWeightage: 5,
        displayOrder: 2,
        topics: [
          { slug: 'earth-location', name: 'Earth location' },
          { slug: 'physical-features', name: 'Physical features' },
          { slug: 'monsoon-weather-climate', name: 'Monsoon, rainfall, weather and climate' },
          { slug: 'water-resources-rivers', name: 'Water resources and rivers' },
          { slug: 'soil-minerals-resources', name: 'Soil, minerals and natural resources' },
          { slug: 'forest-wildlife', name: 'Forest and wildlife' },
          { slug: 'agriculture-pattern', name: 'Agriculture pattern' },
          { slug: 'transport-communication', name: 'Transport and communication' },
          { slug: 'population-density-distribution', name: 'Population density and distribution in Tamil Nadu and India' },
          { slug: 'calamities-disaster-management', name: 'Calamities and disaster management' },
          { slug: 'environment-climate-change', name: 'Environment and climate change' },
          { slug: 'geographical-landmarks', name: 'Geographical landmarks' },
          { slug: 'geography-current-affairs', name: 'Current affairs in Geography' }
        ]
      },
      {
        code: 'Unit III',
        name: 'History, Culture of India and Indian National Movement',
        questionWeightage: 10,
        displayOrder: 3,
        topics: [
          { slug: 'indus-valley-civilization', name: 'Indus Valley Civilization' },
          { slug: 'guptas-sultans-mughals-marathas', name: 'Guptas, Delhi Sultans, Mughals and Marathas' },
          { slug: 'south-indian-history', name: 'South Indian History' },
          { slug: 'national-renaissance', name: 'National Renaissance' },
          { slug: 'early-uprising-british-rule', name: 'Early uprising against British Rule' },
          { slug: 'indian-national-congress', name: 'Indian National Congress' },
          { slug: 'emergence-of-leaders', name: 'Emergence of leaders (Ambedkar, Bhagat Singh, Bharathiar, VOC, Periyar, Nehru, Tagore, Kamarajar, Gandhi, Azad, Rajaji, Bose, Muthulakshmi Ammaiyar, Muvalur Ramamirtham)' },
          { slug: 'agitation-modes-tamil-nadu', name: 'Different modes of agitation in Tamil Nadu and movements' },
          { slug: 'characteristics-indian-culture', name: 'Characteristics of Indian Culture' },
          { slug: 'unity-in-diversity', name: 'Unity in Diversity: race, language and custom' },
          { slug: 'india-secular-state', name: 'India as a secular state' }
        ]
      },
      {
        code: 'Unit IV',
        name: 'Indian Polity',
        questionWeightage: 15,
        displayOrder: 4,
        topics: [
          { slug: 'constitution-of-india', name: 'Constitution of India' },
          { slug: 'preamble-constitution', name: 'Preamble to the Constitution' },
          { slug: 'salient-features-constitution', name: 'Salient features of the Constitution' },
          { slug: 'union-state-territory', name: 'Union, State and Union Territory' },
          { slug: 'citizenship', name: 'Citizenship' },
          { slug: 'fundamental-rights', name: 'Fundamental Rights' },
          { slug: 'fundamental-duties', name: 'Fundamental Duties' },
          { slug: 'directive-principles-state-policy', name: 'Directive Principles of State Policy' },
          { slug: 'union-executive-legislature', name: 'Union Executive and Union Legislature' },
          { slug: 'state-executive-legislature', name: 'State Executive and State Legislature' },
          { slug: 'local-governments-panchayat-raj', name: 'Local Governments and Panchayat Raj' },
          { slug: 'federalism-centre-state-relations', name: 'Spirit of federalism and Centre–State relationships' },
          { slug: 'election', name: 'Election' },
          { slug: 'judiciary-in-india', name: 'Judiciary in India' },
          { slug: 'rule-of-law', name: 'Rule of Law' },
          { slug: 'anti-corruption-lokpal-lokayukta', name: 'Corruption in public life, Lokpal and Lokayukta' },
          { slug: 'right-to-information', name: 'Right to Information' },
          { slug: 'empowerment-of-women', name: 'Empowerment of Women' },
          { slug: 'consumer-protection-forums', name: 'Consumer Protection Forums' },
          { slug: 'human-rights-charter', name: 'Human Rights Charter' },
          { slug: 'political-parties-system', name: 'Political parties and political system in Tamil Nadu and India' },
          { slug: 'polity-current-affairs', name: 'Current affairs in Polity' }
        ]
      },
      {
        code: 'Unit V',
        name: 'Indian Economy and Development Administration in Tamil Nadu',
        questionWeightage: 20,
        displayOrder: 5,
        topics: [
          { slug: 'nature-of-indian-economy', name: 'Nature of Indian economy' },
          { slug: 'five-year-plans-niti-aayog', name: 'Five-year plan models, Planning Commission and Niti Aayog' },
          { slug: 'sources-of-revenue-rbi-finance-comm', name: 'Sources of revenue, Reserve Bank of India and Finance Commission' },
          { slug: 'resource-sharing-gst', name: 'Resource sharing between Union and State Governments and GST' },
          { slug: 'economic-trends-employment', name: 'Economic trends and employment generation' },
          { slug: 'land-reforms-agriculture', name: 'Land reforms, agriculture, and science & technology in agriculture' },
          { slug: 'industrial-growth-rural-welfare', name: 'Industrial growth and rural welfare-oriented programmes' },
          { slug: 'social-problems', name: 'Social problems: population, education, health, employment and poverty' },
          { slug: 'social-justice-harmony', name: 'Social Justice and Social Harmony as cornerstones of development' },
          { slug: 'education-health-tamil-nadu', name: 'Education and Health systems in Tamil Nadu' },
          { slug: 'geography-economic-growth-tn', name: 'Geography of Tamil Nadu and its impact on economic growth' },
          { slug: 'government-welfare-schemes', name: 'Welfare schemes of Government' },
          { slug: 'current-socio-economic-issues', name: 'Current socio-economic issues' }
        ]
      },
      {
        code: 'Unit VI',
        name: 'History, Culture, Heritage and Socio-Political Movements of Tamil Nadu',
        questionWeightage: 20,
        displayOrder: 6,
        topics: [
          { slug: 'history-tamil-society-archaeology', name: 'History of Tamil Society and related archaeological discoveries' },
          { slug: 'tamil-literature-sangam-contemporary', name: 'Tamil Literature from Sangam age till contemporary times' },
          { slug: 'thirukkural-secular-values', name: 'Thirukkural: Significance as secular literature, relevance to everyday life, and universal values' },
          { slug: 'role-tamil-nadu-freedom-struggle', name: 'Role of Tamil Nadu in the freedom struggle and early agitations' },
          { slug: 'role-women-freedom-struggle', name: 'Role of women in the freedom struggle' },
          { slug: 'social-reformers-movements-tn', name: 'Various social reformers and social reform movements' },
          { slug: 'social-transformation-tamil-nadu', name: 'Social transformation of Tamil Nadu' }
        ]
      }
    ]
  },
  {
    code: 'B',
    name: 'Part B: Aptitude and Mental Ability',
    language: 'English',
    questionWeightage: 25,
    displayOrder: 2,
    units: [
      {
        code: 'Unit I',
        name: 'Aptitude',
        questionWeightage: 15,
        displayOrder: 1,
        topics: [
          { slug: 'simplification', name: 'Simplification' },
          { slug: 'percentage', name: 'Percentage' },
          { slug: 'hcf-and-lcm', name: 'Highest Common Factor (HCF) & Lowest Common Multiple (LCM)' },
          { slug: 'ratio-and-proportion', name: 'Ratio and Proportion' },
          { slug: 'simple-interest', name: 'Simple Interest' },
          { slug: 'compound-interest', name: 'Compound Interest' },
          { slug: 'area-and-volume', name: 'Area and Volume' },
          { slug: 'time-and-work', name: 'Time and Work' }
        ]
      },
      {
        code: 'Unit II',
        name: 'Reasoning',
        questionWeightage: 10,
        displayOrder: 2,
        topics: [
          { slug: 'logical-reasoning', name: 'Logical Reasoning' },
          { slug: 'puzzles-dice', name: 'Puzzles and Dice' },
          { slug: 'visual-reasoning', name: 'Visual Reasoning' },
          { slug: 'alphanumeric-reasoning', name: 'Alphanumeric Reasoning' },
          { slug: 'number-series', name: 'Number Series' }
        ]
      }
    ]
  },
  {
    code: 'C',
    name: 'Part C: Tamil Eligibility-cum-Scoring Test (பொதுத் தமிழ்)',
    language: 'Tamil',
    questionWeightage: 100,
    displayOrder: 3,
    units: [
      {
        code: 'அலகு I',
        name: 'இலக்கணம்',
        questionWeightage: 25,
        displayOrder: 1,
        topics: [
          { slug: 'ta-pirithu-serthu', name: 'பிரித்து எழுதுதல்; சேர்த்து எழுதுதல்' },
          { slug: 'ta-sandhi-pizhai', name: 'சந்திப்பிழை அறிதல்' },
          { slug: 'ta-kuril-nedil', name: 'குறில், நெடில் வேறுபாடு' },
          { slug: 'ta-la-zha-verupaadu', name: 'லகர, ளகர, ழகர வேறுபாடு' },
          { slug: 'ta-na-na-verupaadu', name: 'னகர, ணகர வேறுபாடு' },
          { slug: 'ta-ra-ra-verupaadu', name: 'ரகர, றகர வேறுபாடு' },
          { slug: 'ta-ina-ezhuthukal', name: 'இன எழுத்துகள் அறிதல்' },
          { slug: 'ta-suttu-vina-ezhuthukal', name: 'சுட்டு எழுத்துகள்; வினா எழுத்துகள்' },
          { slug: 'ta-orumai-panmai', name: 'ஒருமை, பன்மை அறிதல்' },
          { slug: 'ta-vinaimutru-vinaiyecham', name: 'வினைமுற்று, வினையெச்சம், வினையாலணையும் பெயர், பெயரெச்சம் வகை அறிதல்' },
          { slug: 'ta-ayarchol-thamizhchol', name: 'அயற்சொல் / தமிழ்ச்சொல் அறிதல்' },
          { slug: 'ta-ethirchol-vinaichol', name: 'எதிர்ச்சொல்; வினைச்சொல்' },
          { slug: 'ta-ezhuthuppizhai-otruppizhai', name: 'எழுத்துப்பிழை மற்றும் ஒற்றுப்பிழை நீக்குதல்' }
        ]
      },
      {
        code: 'அலகு II',
        name: 'சொல்லகராதி',
        questionWeightage: 15,
        displayOrder: 2,
        topics: [
          { slug: 'ta-ethirchol-ezhuthuthal', name: 'எதிர்ச்சொல் எழுதுதல்' },
          { slug: 'ta-orezuthu-orumozhi', name: 'ஓரெழுத்து ஒரு மொழி' },
          { slug: 'ta-uriya-porul', name: 'உரிய பொருளைக் கண்டறிதல்' },
          { slug: 'ta-oruporul-pala-sorkal', name: 'ஒருபொருள் தரும் பல சொற்கள்' },
          { slug: 'ta-poruntha-chol', name: 'பொருந்தாச் சொல்லைக் கண்டறிதல்' },
          { slug: 'ta-agara-varisai', name: 'அகர வரிசைப்படி சொற்களைச் சீரமைத்தல்' },
          { slug: 'ta-iruporul-kurikkum-sorkal', name: 'இருபொருள் குறிக்கும் சொற்கள்' },
          { slug: 'ta-pechu-ezhuthu-vazhakku', name: 'பேச்சு வழக்கு மற்றும் எழுத்து வழக்கு' },
          { slug: 'ta-oor-peyar-maruuvu', name: 'ஊர்ப் பெயர்களின் மரூஉ' },
          { slug: 'ta-thooiya-thamizh-sorkal', name: 'பேச்சு வழக்குச் சொற்களுக்கு இணையான தூய தமிழ்ச் சொற்கள்' }
        ]
      },
      {
        code: 'அலகு III',
        name: 'எழுதும் திறன்',
        questionWeightage: 15,
        displayOrder: 3,
        topics: [
          { slug: 'ta-sol-ozhungupaduthal', name: 'சொற்களை ஒழுங்குபடுத்திச் சொற்றொடர் அமைத்தல்' },
          { slug: 'ta-thodar-vagaigal', name: 'தொடர் வகைகள்' },
          { slug: 'ta-seivinai-seyappaattuvinai', name: 'செய்வினை, செயப்பாட்டு வினை' },
          { slug: 'ta-thanvinai-piravinai', name: 'தன்வினை, பிறவினை' },
          { slug: 'ta-marabu-thamizh', name: 'மரபுத் தமிழ் (திணை, பால், காலம், ஒலி, வினை, தொகை மரபு)' },
          { slug: 'ta-niruthatkuriyeedugal', name: 'நிறுத்தல் குறியீடுகள் அறிதல்' }
        ]
      },
      {
        code: 'அலகு IV',
        name: 'கலைச் சொற்கள்',
        questionWeightage: 10,
        displayOrder: 4,
        topics: [
          { slug: 'ta-kalai-ariviyal-kalvi', name: 'அறிவியல் மற்றும் கல்வி கலைச்சொற்கள்' },
          { slug: 'ta-kalai-maruthuvam-melanmai', name: 'மருத்துவம் மற்றும் மேலாண்மை கலைச்சொற்கள்' },
          { slug: 'ta-kalai-sattam-puviyiyal', name: 'சட்டம் மற்றும் புவியியல் கலைச்சொற்கள்' },
          { slug: 'ta-kalai-thozhilnutpam-it', name: 'தொழில்நுட்பம், ஊடகம் மற்றும் தகவல் தொழில்நுட்பம் கலைச்சொற்கள்' }
        ]
      },
      {
        code: 'அலகு V',
        name: 'வாசித்தல் – புரிந்து கொள்ளும் திறன்',
        questionWeightage: 15,
        displayOrder: 5,
        topics: [
          { slug: 'ta-paththi-vinaakkal', name: 'பத்திகள் படித்துச் சரியான விடையைத் தேர்ந்தெடுத்தல்' },
          { slug: 'ta-seithithal-seithigal', name: 'நாளிதழ் செய்திகள், தலையங்கங்கள் மற்றும் அரசு அறிவிப்புகள்' },
          { slug: 'ta-uvamai-pazhamozhi', name: 'உவமை மற்றும் பழமொழிகளின் பொருள் அறிதல்' }
        ]
      },
      {
        code: 'அலகு VI',
        name: 'எளிய மொழி பெயர்ப்பு',
        questionWeightage: 5,
        displayOrder: 6,
        topics: [
          { slug: 'ta-angila-sorkal-thamizhaakkam', name: 'ஆங்கிலச் சொற்களுக்கு இணையான தமிழ்ச் சொற்கள்' },
          { slug: 'ta-kaditham-manukkal-mozhipeyarppu', name: 'கடிதம், தலைப்புகள், கோப்புகள் மற்றும் மனுக்கள் மொழிபெயர்ப்பு' }
        ]
      },
      {
        code: 'அலகு VII',
        name: 'இலக்கியம், தமிழ் அறிஞர்களும் தமிழ்த்தொண்டும்',
        questionWeightage: 15,
        displayOrder: 7,
        topics: [
          { slug: 'ta-thirukkural-20-adhigarangal', name: 'திருக்குறள் (ஒழுக்கமுடைமை, பொறையுடைமை, ஊக்கமுடைமை, விருந்தோம்பல், அன்புடைமை, கல்வி உள்ளிட்ட 20 அதிகாரங்கள்)' },
          { slug: 'ta-aranoolgal-pathinenkeezhkanakku', name: 'அறநூல்கள்: நாலடியார், நான்மணிக்கடிகை, பழமொழி நானூறு, திரிகடுகம், சிறுபஞ்சமூலம், ஏலாதி' },
          { slug: 'ta-thamizh-arinjargal-thondum', name: 'தமிழ் அறிஞர்கள்: உ.வே.சா., பாரதியார், பாரதிதாசன், பெருஞ்சித்திரனார், ஜி.யு. போப், வீரமாமுனிவர், வேலுநாச்சியார்' }
        ]
      }
    ]
  },
  {
    code: 'C_EN',
    name: 'Part C (Optional): General English (Differently-Abled Only)',
    language: 'English',
    questionWeightage: 100,
    displayOrder: 4,
    units: [
      {
        code: 'Unit I',
        name: 'Grammar',
        questionWeightage: 25,
        displayOrder: 1,
        topics: [
          { slug: 'en-parts-of-speech', name: 'Parts of Speech, Tenses and Voice' },
          { slug: 'en-sentence-structure-prepositions', name: 'Sentence pattern, Prepositions and Articles' }
        ]
      },
      {
        code: 'Unit II',
        name: 'Vocabulary',
        questionWeightage: 15,
        displayOrder: 2,
        topics: [
          { slug: 'en-synonyms-antonyms', name: 'Synonyms and Antonyms' },
          { slug: 'en-prefixes-suffixes-idioms', name: 'Prefixes, Suffixes and Idiomatic Phrases' }
        ]
      },
      {
        code: 'Unit III',
        name: 'Writing Skills & Technical Terms',
        questionWeightage: 20,
        displayOrder: 3,
        topics: [
          { slug: 'en-official-correspondence', name: 'Official correspondence, notes, and technical terms' }
        ]
      },
      {
        code: 'Unit IV',
        name: 'Reading Comprehension & Literary Works',
        questionWeightage: 40,
        displayOrder: 4,
        topics: [
          { slug: 'en-comprehension-passages', name: 'Comprehension passages from prose and poetry' },
          { slug: 'en-literary-figures-appreciation', name: 'Poetic devices and literary appreciation' }
        ]
      }
    ]
  }
];

module.exports = {
  examData,
  syllabusStructure
};

