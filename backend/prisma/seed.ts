import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[MoTA Seed] Clearing existing database records...');
  await prisma.auditLog.deleteMany();
  await prisma.meritEntry.deleteMany();
  await prisma.deficiencyNotice.deleteMany();
  await prisma.document.deleteMany();
  await prisma.application.deleteMany();
  await prisma.schemeConfig.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  console.log('[MoTA Seed] Creating Administrative & Officer users...');

  // Ministry Super Admin
  const ministryAdmin = await prisma.user.create({
    data: {
      email: 'admin@mota.gov.in',
      password: hashedPassword,
      fullName: 'Dr. Rameshwar Munda (IAS)',
      role: 'MINISTRY_ADMIN',
      state: 'New Delhi',
      phone: '+91 98765 43210',
      category: 'ST',
    },
  });

  // State Nodal Officer (Jharkhand)
  const stateAdmin = await prisma.user.create({
    data: {
      email: 'state.jharkhand@mota.gov.in',
      password: hashedPassword,
      fullName: 'Sunita Oraon (Nodal Officer)',
      role: 'STATE_ADMIN',
      state: 'Jharkhand',
      district: 'Ranchi',
      phone: '+91 98123 45678',
      category: 'ST',
    },
  });

  // District Verification Officer
  const verifier = await prisma.user.create({
    data: {
      email: 'verifier.ranchi@mota.gov.in',
      password: hashedPassword,
      fullName: 'Anil Kumar Hansda (Scrutiny Officer)',
      role: 'VERIFIER',
      state: 'Jharkhand',
      district: 'Ranchi',
      phone: '+91 97654 32109',
      category: 'ST',
    },
  });

  console.log('[MoTA Seed] Seeding 5 Official Schemes with Benefit Structures & Rules...');

  // 1. Pre-Matric (BPVGK)
  const preMatricScheme = await prisma.scheme.create({
    data: {
      code: 'BPVGK',
      name: 'Pre-Matric Scholarship Scheme For ST Student',
      description: 'Centrally Sponsored Scheme providing financial support to ST students studying in Classes IX and X to minimize dropout rates. Benefits: ₹225/mo for Day Scholars, ₹525/mo for Hostellers (10 months/year). Income cap: ₹2.5L/yr.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-01'),
      applicationWindowEnd: new Date('2026-12-31'),
      isActive: true,
      budgetAllocation: 120000000.0,
      budgetUtilized: 45000000.0,
      totalSeats: 15000,
    },
  });

  // 2. Post-Matric (BVOBC)
  const postMatricScheme = await prisma.scheme.create({
    data: {
      code: 'BVOBC',
      name: 'Post-Matric Scholarship Scheme For ST Students',
      description: 'Centrally Sponsored Scheme assisting ST students in post-secondary education (Class XI, XII, UG, PG, Diploma). Benefits: Full compulsory fees reimbursement + maintenance allowance ₹230 to ₹1,200/mo. Income cap: ₹2.5L/yr.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-01'),
      applicationWindowEnd: new Date('2026-12-31'),
      isActive: true,
      budgetAllocation: 250000000.0,
      budgetUtilized: 110000000.0,
      totalSeats: 25000,
    },
  });

  // 3. Top Class Education (A023B)
  const topClassScheme = await prisma.scheme.create({
    data: {
      code: 'A023B',
      name: 'Top Class Education For ST Students',
      description: 'Central Sector Scheme providing full tuition fee reimbursement, living allowance (₹3,000/mo), books allowance (₹5,000/yr), and computer allowance (₹45,000 one-time) for meritorious ST students at listed premier institutes (IITs, IIMs, NITs, AIIMS, NIFTs, NLUs). Income cap: ₹6.0L/yr.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-10'),
      applicationWindowEnd: new Date('2026-11-30'),
      isActive: true,
      budgetAllocation: 60000000.0,
      budgetUtilized: 25000000.0,
      totalSeats: 1000,
    },
  });

  // 4. National Fellowship (ARG45)
  const nfstScheme = await prisma.scheme.create({
    data: {
      code: 'ARG45',
      name: 'National Fellowship for ST Students',
      description: 'Central Sector Scheme providing fellowship for M.Phil (₹25,000/mo) and Ph.D. (₹28,000/mo) + HRA and annual contingency allowance (₹10,000 to ₹20,500/yr) for ST students in UGC/AICTE recognized universities. Merit evaluated on Master’s degree marks.',
      portalType: 'FELLOWSHIP',
      applicationWindowStart: new Date('2026-01-01'),
      applicationWindowEnd: new Date('2026-12-31'),
      isActive: true,
      budgetAllocation: 55000000.0,
      budgetUtilized: 21000000.0,
      totalSeats: 750,
    },
  });

  // 5. National Overseas Scholarship (AZKMI)
  const nosScheme = await prisma.scheme.create({
    data: {
      code: 'AZKMI',
      name: 'National Overseas Scholarship Scheme',
      description: 'Central Sector Scheme funding Master’s, Ph.D., and Post-Doctoral research in top 500 foreign universities. Benefits: Full tuition fees + USD 15,400 annual maintenance allowance + USD 1,500 contingency + air travel allowance. Income cap: ₹6.0L/yr.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-15'),
      applicationWindowEnd: new Date('2026-11-30'),
      isActive: true,
      budgetAllocation: 80000000.0,
      budgetUtilized: 34000000.0,
      totalSeats: 20,
    },
  });

  // Standard Rules & Configs
  const tieBreakers = ['lower_family_income', 'older_age', 'earlier_submission_time'];
  const scoringWeightage = {
    academicMarksWeight: 50,
    incomeWeight: 30,
    pvtgBonus: 15,
    femaleBonus: 5,
    maxIncomeCap: 600000,
  };

  // Config: Pre-Matric
  await prisma.schemeConfig.create({
    data: {
      schemeId: preMatricScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_p1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 250000, description: 'Annual family income must not exceed ₹2,50,000/-' },
        { id: 'rule_p2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
        { id: 'rule_p3', field: 'currentClass', label: 'Class IX or X Enrollment', operator: 'in', value: ['Class IX', 'Class X'], description: 'Must be studying in Class IX or X in a recognized school.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'MARK_SHEET', name: 'Class VIII / IX Marksheet', required: true },
      ]),
      scoringWeightageJson: JSON.stringify({ ...scoringWeightage, maxIncomeCap: 250000 }),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: Post-Matric
  await prisma.schemeConfig.create({
    data: {
      schemeId: postMatricScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_pm1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 250000, description: 'Annual family income must not exceed ₹2,50,000/-' },
        { id: 'rule_pm2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
        { id: 'rule_pm3', field: 'isRecognizedCollege', label: 'Recognized College / University', operator: '==', value: true, description: 'Must be enrolled in a post-secondary course.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'MARK_SHEET', name: 'Class X / XII / Graduation Marksheet', required: true },
      ]),
      scoringWeightageJson: JSON.stringify({ ...scoringWeightage, maxIncomeCap: 250000 }),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: Top Class
  await prisma.schemeConfig.create({
    data: {
      schemeId: topClassScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_tc1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income must not exceed ₹6,00,000/-' },
        { id: 'rule_tc2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
        { id: 'rule_tc3', field: 'isTopClassInstitute', label: 'Notified Premier Institute', operator: '==', value: true, description: 'Must be admitted into a MoTA notified Top Class Premier Institute (IIT, IIM, NIT, AIIMS, NLU, etc.).' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'ADMISSION_LETTER', name: 'Institute Fee Structure & Admission Offer', required: true },
      ]),
      scoringWeightageJson: JSON.stringify(scoringWeightage),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: NFST
  await prisma.schemeConfig.create({
    data: {
      schemeId: nfstScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_nf1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income from all sources must not exceed ₹6,00,000/-' },
        { id: 'rule_nf2', field: 'aggregateMarks', label: 'Post-Graduation Minimum Marks', operator: '>=', value: 55, description: 'Must have secured a minimum of 55% aggregate marks in PG Degree.' },
        { id: 'rule_nf3', field: 'category', label: 'Category Verification', operator: '==', value: 'ST', description: 'Applicant must belong to a notified Scheduled Tribe community.' },
        { id: 'rule_nf4', field: 'isApprovedInstitution', label: 'MoTA Approved University / Institute', operator: '==', value: true, description: 'Course must be pursued at a UGC/MoE accredited premier institution.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'MARK_SHEET', name: 'Post-Graduation Marksheet / Degree', required: true },
        { type: 'ADMISSION_LETTER', name: 'Ph.D / M.Phil Admission Offer Letter', required: true },
      ]),
      scoringWeightageJson: JSON.stringify(scoringWeightage),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: NOS
  await prisma.schemeConfig.create({
    data: {
      schemeId: nosScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_nos1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income must not exceed ₹6,00,000/-' },
        { id: 'rule_nos2', field: 'aggregateMarks', label: 'Qualifying Exam Minimum Marks', operator: '>=', value: 60, description: 'Must have secured a minimum of 60% aggregate marks in qualifying exam.' },
        { id: 'rule_nos3', field: 'passportValid', label: 'Valid Indian Passport', operator: '==', value: true, description: 'Must possess a valid Indian passport.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'PASSPORT', name: 'Valid Passport Copy', required: true },
        { type: 'ADMISSION_LETTER', name: 'Foreign University Unconditional Offer Letter', required: true },
      ]),
      scoringWeightageJson: JSON.stringify(scoringWeightage),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  console.log('[MoTA Seed] Generating 175 realistic synthetic applicant records across 28 States & UTs...');

  const statesDistricts = [
    { state: 'Jharkhand', districts: ['Ranchi', 'Dumka', 'Simdega', 'Hazaribagh', 'Khunti', 'Girdih'] },
    { state: 'Madhya Pradesh', districts: ['Dindori', 'Mandla', 'Jhabua', 'Barwani', 'Dhar'] },
    { state: 'Odisha', districts: ['Mayurbhanj', 'Gajapati', 'Koraput', 'Rayagada', 'Sundargarh'] },
    { state: 'Rajasthan', districts: ['Udaipur', 'Banswara', 'Dungarpur', 'Pratapgarh'] },
    { state: 'Assam', districts: ['Kokrajhar', 'Baksa', 'Udalguri', 'Chirang'] },
    { state: 'Maharashtra', districts: ['Raigad', 'Palghar', 'Nandurbar', 'Gadchiroli'] },
    { state: 'Telangana', districts: ['Nagarkurnool', 'Adilabad', 'Khammam'] },
    { state: 'Chhattisgarh', districts: ['Bastar', 'Gariaband', 'Dantewada', 'Kanker', 'Surguja'] },
    { state: 'Gujarat', districts: ['Dahod', 'Panchmahal', 'Tapi', 'Dang'] },
    { state: 'Tamil Nadu', districts: ['Nilgiris', 'Salem', 'Erode'] },
    { state: 'Meghalaya', districts: ['East Khasi Hills', 'West Garo Hills'] },
    { state: 'Mizoram', districts: ['Aizawl', 'Lunglei'] },
    { state: 'Nagaland', districts: ['Kohima', 'Dimapur'] },
    { state: 'Arunachal Pradesh', districts: ['Itanagar', 'Tawang'] },
  ];

  const pvtgGroups = ['Birhor', 'Baiga', 'Saora', 'Katkari', 'Chenchu', 'Kamar', 'Toda', 'Maria Gond', 'Korwa', 'Pahari Korwa'];
  const nonPvtgTribes = ['Santhal', 'Oraon', 'Munda', 'Gond', 'Meena', 'Bodo', 'Bhil', 'Khadia', 'Garo', 'Khasi', 'Kuki', 'Naga', 'Halba'];

  const firstNames = ['Amit', 'Priya', 'Sanjay', 'Meena', 'Vikram', 'Deepak', 'Ankita', 'Rahul', 'Kavita', 'Rohan', 'Sunil', 'Aarti', 'Manish', 'Pooja', 'Rajesh', 'Ritu', 'Karan', 'Sneha', 'Arjun', 'Divya', 'Suresh', 'Lata', 'Vijay', 'Anita', 'Bikram', 'Sunita', 'Gopal', 'Nisha', 'Suraj', 'Neelam'];
  const statusPool = ['SUBMITTED', 'SUBMITTED', 'UNDER_SCRUTINY', 'DEFICIENCY_RAISED', 'RESUBMITTED', 'SHORTLISTED', 'SELECTED', 'REJECTED'];
  const schemesList = [preMatricScheme, postMatricScheme, topClassScheme, nfstScheme, nosScheme];

  const totalRecords = 175;

  for (let i = 0; i < totalRecords; i++) {
    const loc = statesDistricts[i % statesDistricts.length];
    const district = loc.districts[i % loc.districts.length];
    const isPvtg = i % 5 === 0;
    const pvtg = isPvtg ? pvtgGroups[i % pvtgGroups.length] : null;
    const tribe = isPvtg ? `${pvtg} (PVTG)` : nonPvtgTribes[i % nonPvtgTribes.length];

    const firstName = firstNames[i % firstNames.length];
    const lastName = isPvtg ? pvtg : tribe.split(' ')[0];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 101}@gmail.com`;
    const gender = i % 2 === 0 ? 'Female' : 'Male';

    // Varied Income (Some within cap, some above cap for realistic rejection testing)
    const baseIncome = (i % 7 === 0) ? 680000 : (i % 4 === 0) ? 320000 : (80000 + (i * 3500) % 180000);
    const marks = Math.min(98, Math.max(52, 65 + ((i * 7) % 32) + (i % 2 === 0 ? 3 : 0)));

    const status = statusPool[i % statusPool.length];
    const conf = status === 'DEFICIENCY_RAISED' ? 62.5 : Math.min(99, 88 + (i % 11));
    const risk = status === 'DEFICIENCY_RAISED' || baseIncome > 600000 ? 'HIGH' : (i % 6 === 0 ? 'MEDIUM' : 'LOW');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'APPLICANT',
        state: loc.state,
        district,
        category: 'ST',
        pvtgGroup: pvtg,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        aadhaarNumber: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
        digilockerId: `DIGI-ST-${10000 + i}`,
      },
    });

    const targetScheme = schemesList[i % schemesList.length];
    const appNo = `MOTA-${targetScheme.code}-2026-${String(i + 1).padStart(5, '0')}`;

    const formDataObj = {
      fullName,
      email,
      gender,
      tribeName: tribe,
      isPVTG: Boolean(pvtg),
      annualIncome: baseIncome,
      aggregateMarks: marks,
      courseName: targetScheme.code === 'BPVGK' ? 'Class X (Secondary Education)' : targetScheme.code === 'BVOBC' ? 'Higher Secondary Science (Class XII)' : targetScheme.code === 'A023B' ? 'B.Tech Computer Science' : targetScheme.code === 'AZKMI' ? 'M.Sc Artificial Intelligence (Oxford)' : 'Ph.D Energy Studies',
      institutionName: targetScheme.code === 'A023B' ? 'IIT Bombay' : targetScheme.code === 'AZKMI' ? 'University of Oxford' : 'Central University of Jharkhand',
      isApprovedInstitution: true,
      isRecognizedCollege: true,
      isTopClassInstitute: true,
      currentClass: targetScheme.code === 'BPVGK' ? 'Class X' : 'Degree',
      bankAccountNo: `918273645${i}`,
      ifscCode: 'SBIN0001234',
    };

    const application = await prisma.application.create({
      data: {
        applicationNo: appNo,
        userId: user.id,
        schemeId: targetScheme.id,
        schemeConfigVersion: 1,
        status,
        riskLevel: risk,
        aiConfidenceScore: conf,
        formDataJson: JSON.stringify(formDataObj),
        submittedAt: new Date(Date.now() - (totalRecords - i) * 14400 * 1000),
      },
    });

    // Create Documents
    await prisma.document.create({
      data: {
        applicationId: application.id,
        type: 'CASTE_CERT',
        fileName: `${firstName.toLowerCase()}_caste_certificate.png`,
        fileUrl: '/sample-docs/caste_certificate.png',
        ocrExtractedJson: JSON.stringify({
          applicantName: fullName,
          casteTribeName: tribe,
          certificateNumber: `ST/CERT/2025/${1000 + i}`,
          issuingAuthority: `SDM Court, ${district}`,
        }),
        ocrConfidenceScore: conf,
        verificationStatus: risk === 'HIGH' ? 'FLAGGED' : 'VERIFIED',
      },
    });

    await prisma.document.create({
      data: {
        applicationId: application.id,
        type: 'INCOME_CERT',
        fileName: `${firstName.toLowerCase()}_income_certificate.png`,
        fileUrl: '/sample-docs/income_certificate.png',
        ocrExtractedJson: JSON.stringify({
          applicantName: fullName,
          annualIncome: status === 'DEFICIENCY_RAISED' ? baseIncome + 150000 : baseIncome,
          certificateNumber: `INC/2025/${2000 + i}`,
          issuingAuthority: `Tehsildar, ${district}`,
        }),
        ocrConfidenceScore: status === 'DEFICIENCY_RAISED' ? 62.5 : 95.0,
        verificationStatus: status === 'DEFICIENCY_RAISED' ? 'FLAGGED' : 'VERIFIED',
        mismatchFlagsJson: status === 'DEFICIENCY_RAISED'
          ? JSON.stringify([{ field: 'annualIncome', documentValue: `₹${baseIncome + 150000}`, formValue: `₹${baseIncome}`, severity: 'CRITICAL', description: 'Income Certificate value mismatch detected by OCR scanner.' }])
          : '[]',
      },
    });

    // Create Deficiency Notice if status is DEFICIENCY_RAISED
    if (status === 'DEFICIENCY_RAISED') {
      await prisma.deficiencyNotice.create({
        data: {
          applicationId: application.id,
          raisedById: verifier.id,
          reason: 'Income mismatch between uploaded Income Certificate and application form entry.',
          remarks: 'Uploaded income certificate shows ₹1,50,000 higher than declared form income. Please upload updated Tehsildar certificate.',
          category: 'DOCUMENT_MISMATCH',
          deadline: new Date(Date.now() + 5 * 86400 * 1000),
          status: 'OPEN',
        },
      });
    }

    // Merit Entry Calculation
    const academicPoints = (marks / 100) * 50;
    const incomePoints = (1 - Math.min(600000, baseIncome) / 600000) * 30;
    const pvtgPoints = pvtg ? 15 : 0;
    const femalePoints = gender === 'Female' ? 5 : 0;
    const score = Math.round((academicPoints + incomePoints + pvtgPoints + femalePoints) * 100) / 100;

    await prisma.meritEntry.create({
      data: {
        applicationId: application.id,
        schemeId: targetScheme.id,
        computedScore: score,
        scoreBreakdownJson: JSON.stringify({ academicPoints, incomePoints, pvtgPoints, femalePoints, total: score }),
        rank: i + 1,
        category: 'ST',
        state: loc.state,
        isOverridden: false,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        applicationId: application.id,
        actorId: user.id,
        actorRole: 'APPLICANT',
        action: 'SUBMITTED',
        reason: 'Initial submission of application',
        previousState: 'DRAFT',
        newState: status,
      },
    });
  }

  console.log(`[MoTA Seed] Seed completed successfully with ${totalRecords} synthetic records!`);
  console.log(`Summary of Pre-Configured Demo Credentials:`);
  console.log(`-----------------------------------------------------`);
  console.log(`Ministry Admin: admin@mota.gov.in / Password123!`);
  console.log(`State Nodal Officer: state.jharkhand@mota.gov.in / Password123!`);
  console.log(`District Verifier: verifier.ranchi@mota.gov.in / Password123!`);
  console.log(`ST Applicant 1: amit.santhal@gmail.com / Password123!`);
  console.log(`-----------------------------------------------------`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
