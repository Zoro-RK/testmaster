const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const SyllabusTopic = require('../models/SyllabusTopic');
const SyllabusUnit = require('../models/SyllabusUnit');
const SyllabusPart = require('../models/SyllabusPart');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Comprehensive concept notes for standard portions
const PORTION_NOTES = {
  'default': {
    overview: 'This portion study guide covers the foundational syllabus topics selected for this practice test. Carefully review these core concepts, definitions, and previous exam trends before starting the timed MCQ examination.',
    keyPoints: [
      'Understand the fundamental principles, official terminology, and factual relationships.',
      'Pay close attention to key dates, constitutional articles, scientific formulas, and grammatical classifications.',
      'Take quick mental notes on frequently confused definitions and exceptions.',
      'Revise related previous years’ question patterns before launching your attempt.'
    ],
    summarySections: [
      {
        title: 'Syllabus Focus & High-Yield Areas',
        content: 'Candidates are evaluated on conceptual clarity, factual accuracy, and the ability to apply learned concepts to multiple-choice scenario questions.'
      },
      {
        title: 'Strategy for This Portion',
        content: 'Eliminate clearly incorrect options first. For negative or deceptive phrasing (e.g., "Which of the following is NOT correct?"), read each option thoroughly.'
      }
    ]
  },
  'polity': {
    overview: 'Comprehensive revision guide for Indian Polity: Preamble, Fundamental Rights (Articles 12–35), Writs, and Salient Features of the Indian Constitution.',
    keyPoints: [
      'Preamble: Sovereign, Socialist, Secular, Democratic, Republic. The words "Socialist", "Secular", and "Integrity" were added by the 42nd Constitutional Amendment Act, 1976.',
      'Part III of the Constitution: Articles 12 to 35 cover Fundamental Rights (derived from the US Constitution).',
      'Article 14: Equality before law (British concept) and equal protection of the laws (American concept).',
      'Article 19 guarantees 6 democratic freedoms: speech, assembly, association, movement, residence, and profession.',
      'Article 20 & 21: Cannot be suspended even during a National Emergency (44th Amendment Act, 1978).',
      'Article 21A: Right to Education added by the 86th Constitutional Amendment Act, 2002.',
      'Article 32: Right to Constitutional Remedies. Dr. B.R. Ambedkar termed it the "Heart and Soul of the Constitution".',
      'Writs (Supreme Court under Art 32, High Court under Art 226): Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto.'
    ],
    summarySections: [
      {
        title: 'Classification of Fundamental Rights',
        content: '1. Right to Equality (Arts 14-18)\n2. Right to Freedom (Arts 19-22)\n3. Right against Exploitation (Arts 23-24)\n4. Right to Freedom of Religion (Arts 25-28)\n5. Cultural and Educational Rights (Arts 29-30)\n6. Right to Constitutional Remedies (Art 32)'
      },
      {
        title: 'Important Writs & Significance',
        content: '• Habeas Corpus: "To have the body of" — against illegal detention.\n• Mandamus: "We command" — to compel performance of public duty.\n• Prohibition: Issued by higher court to lower court preventing jurisdictional excess.\n• Certiorari: "To be certified" — quashing orders of inferior courts/tribunals.\n• Quo-Warranto: "By what authority" — challenging illegal usurpation of public office.'
      }
    ]
  },
  'science': {
    overview: 'Essential study guide for General Science: Nature of Universe, Physical Quantities, Motion Laws, Force, Energy, and Everyday Applications of Physics and Chemistry.',
    keyPoints: [
      'Fundamental Quantities: Length (m), Mass (kg), Time (s), Electric Current (A), Temperature (K), Amount of Substance (mol), Luminous Intensity (cd).',
      'Scalars vs. Vectors: Scalars have magnitude only (Distance, Speed, Mass, Energy, Power). Vectors have both magnitude and direction (Displacement, Velocity, Acceleration, Force, Momentum).',
      'Newton’s Laws of Motion: 1st Law (Inertia), 2nd Law (Force F = ma, rate of change of momentum), 3rd Law (Action and reaction are equal and opposite).',
      'Energy & Power: Work = Force × Displacement. Kinetic Energy = ½mv², Potential Energy = mgh. Power is work per unit time (Watt = Joule/sec).',
      'Atmospheric Pressure: Measured with a barometer (Torricelli). Standard pressure = 760 mm of Hg = 1.013 × 10⁵ Pa.',
      'Acids, Bases & Salts: Acids turn blue litmus red (pH < 7). Bases turn red litmus blue (pH > 7). Neutral pH is 7 (pure water).'
    ],
    summarySections: [
      {
        title: 'Scientific Laws & Inventions',
        content: '• Law of Conservation of Energy: Energy can neither be created nor destroyed; only converted from one form to another.\n• Universal Law of Gravitation: F = G(m₁m₂)/r² where G is gravitational constant (6.67 × 10⁻¹¹ N m²/kg²).'
      },
      {
        title: 'Everyday Science Applications',
        content: '• Convex lenses are used in magnifying glasses and correcting hypermetropia (long-sightedness).\n• Concave lenses are used in correcting myopia (short-sightedness).\n• Sound travels fastest in solids, slower in liquids, and slowest in gases (cannot travel in vacuum).'
      }
    ]
  },
  'tamil': {
    overview: 'டி.என்.பி.எஸ்.சி குரூப் 4 பொதுத் தமிழ் தயாரிப்பு வழிகாட்டி: அலகு I இலக்கணம், புணர்ச்சி, சந்திப்பிழை நீக்குதல், மற்றும் அலகு VII திருக்குறள் (20 அதிகாரங்கள்) மற்றும் தமிழ் அறிஞர்கள்.',
    keyPoints: [
      'பிரித்து எழுதுதல் & புணர்ச்சி: ஈறுபோதல், முன்னின்ற மெய்திரிதல், ஆதிநீடல், அடியகரம் ஐயாதல் போன்ற புணர்ச்சி விதிகளை நினைவில் கொள்க.',
      'மோனை & எதுகை: அடியிலோ சீரிலோ முதல் எழுத்து ஒன்றி வருவது மோனை; இரண்டாம் எழுத்து ஒன்றி வருவது எதுகை.',
      'மோனை வகைகள்: இணை (1,2), பொழிப்பு (1,3), ஒரூஉ (1,4), கூழை (1,2,3), மேற்கதுவாய் (1,3,4), கீழ்க்கதுவாய் (1,2,4), முற்று (1,2,3,4).',
      'திருக்குறள் அமைப்பு: 133 அதிகாரங்கள், 1330 குறட்பாக்கள். அறத்துப்பால் (38), பொருட்பால் (70), காமத்துப்பால் (25).',
      'முக்கிய அதிகாரங்கள்: ஒழுக்கமுடைமை, பொறையுடைமை, ஊக்கமுடைமை, விருந்தோம்பல், அன்புடைமை, கல்வி, நடுவுநிலைமை, புறங்கூறாமை, அருளுடைமை.',
      'தமிழ்த்தாத்தா: உ.வே. சாமிநாதையர் — பழங்கால ஓலைச்சுவடிகளைத் தேடி அச்சு வடிவில் பதிப்பித்தவர்.',
      'மகாகவி பாரதியார்: பாஞ்சாலி சபதம், கண்ணன் பாட்டு, குயில் பாட்டு; புரட்சிக் கவிஞர் பாரதிதாசன்: குடும்ப விளக்கு, பாண்டியன் பரிசு.'
    ],
    summarySections: [
      {
        title: 'இலக்கணக் குறிப்புகள்',
        content: '• பெயரெச்சம்: பெயர்ச்சொல்லைக் கொண்டு முடியும் எச்சவினை (எ.கா. கற்ற பாடம்).\n• வினையெச்சம்: வினைச்சொல்லைக் கொண்டு முடியும் எச்சவினை (எ.கா. படித்து வந்தான்).\n• வினையாலணையும் பெயர்: வினையைச் செய்தவரைக் குறிக்கும் சொல் (எ.கா. பாடியவள்).'
      },
      {
        title: 'திருக்குறள் மேற்கோள்கள் & சிறப்பு',
        content: 'திருக்குறள் உலகப் பொதுமறை, வாயுறை வாழ்த்து, உத்தரவேதம் எனப் போற்றப்படுகிறது. ஜி.யு. போப் திருக்குறளை ஆங்கிலத்தில் முழுமையாக மொழிபெயர்த்துள்ளார்.'
      }
    ]
  }
};

function getPortionCategory(title = '', partCode = '', unitName = '') {
  const combined = `${title} ${partCode} ${unitName}`.toLowerCase();
  if (combined.includes('polity') || combined.includes('constitution') || combined.includes('right')) return 'polity';
  if (combined.includes('science') || combined.includes('physics') || combined.includes('chemistry')) return 'science';
  if (combined.includes('tamil') || combined.includes('தமிழ்') || combined.includes('இலக்கணம்') || combined.includes('திருக்குறள்')) return 'tamil';
  return 'default';
}

/**
 * Generate a clean, academic PDF portion study guide for a given test
 */
async function generatePortionPdf(test, destinationPath) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 45, right: 45 }
      });

      const writeStream = fs.createWriteStream(destinationPath);
      doc.pipe(writeStream);

      // Colors matching ui&ux.md
      const colorTeal = '#176B67';
      const colorInk = '#172633';
      const colorPaper = '#FAF8F2';
      const colorSaffron = '#E7A33E';
      const colorMuted = '#71808A';
      const colorLine = '#E3E4DE';

      // Load syllabus details
      let partName = test.partId || 'Part A: General Studies';
      let unitName = (test.unitIds && test.unitIds[0]) || 'General Studies Unit';
      let topicNames = [];

      try {
        if (test.partId) {
          const part = await SyllabusPart.findById(test.partId) || await SyllabusPart.findOne({ code: test.partId });
          if (part) partName = `${part.code} — ${part.name}`;
        }
        if (test.topicIds && test.topicIds.length > 0) {
          const topics = await SyllabusTopic.find({ _id: { $in: test.topicIds } });
          topicNames = topics.map(t => t.name);
        }
      } catch (e) {
        // use defaults
      }

      const category = getPortionCategory(test.title, test.partId, unitName);
      const notes = PORTION_NOTES[category] || PORTION_NOTES['default'];

      // --- HEADER BAR ---
      doc.rect(45, 40, 505, 75).fill(colorInk);

      doc.fillColor(colorSaffron).fontSize(10).font('Helvetica-Bold')
         .text('TNPSC COMBINED CIVIL SERVICES EXAMINATION – IV (GROUP IV)', 60, 52);

      doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold')
         .text(test.title || 'Portion Study Guide', 60, 68, { width: 475, ellipsis: true });

      doc.fillColor('#B0C0CC').fontSize(9).font('Helvetica')
         .text(`Syllabus Portion: ${partName}  •  Recommended Study Material  •  Question Weightage: ${test.questionCount} MCQs`, 60, 92);

      // --- METADATA STRIP ---
      doc.rect(45, 125, 505, 32).fill('#F0EEE6');
      doc.strokeColor(colorLine).lineWidth(1).rect(45, 125, 505, 32).stroke();

      doc.fillColor(colorTeal).fontSize(9).font('Helvetica-Bold')
         .text('Duration: ', 60, 136, { continued: true })
         .fillColor(colorInk).font('Helvetica').text(`${test.durationMinutes || 15} Mins  |  `, { continued: true })
         .fillColor(colorTeal).font('Helvetica-Bold').text('Language: ', { continued: true })
         .fillColor(colorInk).font('Helvetica').text(`${test.language || 'English'}  |  `, { continued: true })
         .fillColor(colorTeal).font('Helvetica-Bold').text('Status: ', { continued: true })
         .fillColor('#287A58').text('Study Portion (Pre-Exam Preparation)');

      let yPos = 175;

      // --- SECTION 1: PORTION OVERVIEW ---
      doc.fillColor(colorTeal).fontSize(13).font('Helvetica-Bold')
         .text('1. Portion Overview & Objective', 45, yPos);
      yPos += 18;

      doc.fillColor(colorInk).fontSize(10).font('Helvetica').lineGap(4)
         .text(notes.overview, 45, yPos, { width: 505, align: 'justify' });
      yPos = doc.y + 16;

      // --- SECTION 2: TOPICS COVERED IN THIS PORTION ---
      doc.fillColor(colorTeal).fontSize(13).font('Helvetica-Bold')
         .text('2. Syllabus Topics Covered in this Test', 45, yPos);
      yPos += 18;

      const topicsToDisplay = topicNames.length > 0 ? topicNames : [
        test.title,
        'Fundamental Concepts & Terminology',
        'Practical Applications & Previous Year Trends'
      ];

      topicsToDisplay.forEach((top, idx) => {
        doc.fillColor(colorSaffron).fontSize(11).font('Helvetica-Bold')
           .text('•', 55, yPos, { continued: true })
           .fillColor(colorInk).fontSize(10).font('Helvetica-Bold')
           .text(`  ${top}`);
        yPos += 16;
      });
      yPos += 10;

      // --- SECTION 3: CORE HIGH-YIELD POINTS TO STUDY ---
      doc.fillColor(colorTeal).fontSize(13).font('Helvetica-Bold')
         .text('3. Key Concept Summary & High-Yield Revision Points', 45, yPos);
      yPos += 18;

      notes.keyPoints.forEach((point, idx) => {
        if (yPos > 720) {
          doc.addPage();
          yPos = 45;
        }

        doc.fillColor(colorTeal).fontSize(10).font('Helvetica-Bold')
           .text(`${idx + 1}.`, 55, yPos);

        doc.fillColor(colorInk).fontSize(9.5).font('Helvetica').lineGap(3)
           .text(point, 75, yPos, { width: 475, align: 'justify' });

        yPos = doc.y + 8;
      });
      yPos += 10;

      // --- SECTION 4: DETAILED EXPLANATION BOXES ---
      notes.summarySections.forEach((sec, idx) => {
        if (yPos > 660) {
          doc.addPage();
          yPos = 45;
        }

        doc.rect(45, yPos, 505, 24).fill('#EBF5F3');
        doc.fillColor(colorTeal).fontSize(11).font('Helvetica-Bold')
           .text(sec.title, 55, yPos + 6);
        yPos += 30;

        doc.fillColor(colorInk).fontSize(9.5).font('Helvetica').lineGap(3)
           .text(sec.content, 55, yPos, { width: 490 });
        yPos = doc.y + 16;
      });

      // --- FOOTER NOTE ---
      if (yPos > 720) {
        doc.addPage();
        yPos = 45;
      }

      doc.rect(45, yPos, 505, 42).fill('#FAF8F2');
      doc.strokeColor(colorLine).lineWidth(1).rect(45, yPos, 505, 42).stroke();

      doc.fillColor(colorTeal).fontSize(9).font('Helvetica-Bold')
         .text('Exam Instruction Note:', 55, yPos + 8);
      doc.fillColor(colorMuted).fontSize(8.5).font('Helvetica')
         .text('After reading and revising this portion, return to the test detail page and click "Start Examination". The timer will begin, and question options will be presented.', 55, yPos + 22, { width: 485 });

      // Add page numbers
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fillColor(colorMuted).fontSize(8).font('Helvetica')
           .text(`TNPSC Study Circle  •  Portion Study Guide  •  Page ${i + 1} of ${range.count}`, 45, 800, { align: 'center', width: 505 });
      }

      doc.end();
      writeStream.on('finish', () => resolve(destinationPath));
      writeStream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Returns or generates the portion study PDF path for a test
 */
async function getOrGeneratePortionPdf(test) {
  const safeTitle = (test.title || 'Portion_Study_Guide').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `portion_guide_${test._id}_${safeTitle}.pdf`;
  const fullPath = path.join(uploadsDir, filename);

  // If already exists and size > 0, return existing
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    if (stats.size > 100) {
      return { filename, fullPath, url: `/uploads/${filename}` };
    }
  }

  // Generate new PDF
  await generatePortionPdf(test, fullPath);
  return { filename, fullPath, url: `/uploads/${filename}` };
}

module.exports = {
  getOrGeneratePortionPdf,
  generatePortionPdf,
  PORTION_NOTES,
  getPortionCategory
};

